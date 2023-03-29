import { Bot } from 'mineflayer';
import {
  StateMachineTargets,
  StateTransition,
  NestedStateMachine,
} from 'mineflayer-statemachine';
import {
  BehaviorWait,
  BehaviorCheckFields,
  BehaviorHarvestField,
  BehaviorSowField,
  BehaviorCheckInventory,
  BehaviorDepositItems,
  BehaviorCheckChests,
  BehaviorCompletedSowing,
  BehaviorCompletedHarvesting,
  BehaviorCompletedDeposit,
} from '../behaviors';
import { timeIn } from '../helpers';
import { IFarmer } from '../types/farmer';
import { loadStandByStateMachine } from './standBy';

export const loadFarmingStateMachine = (bot: Bot, config: IFarmer) => {
  const targets: StateMachineTargets = {
    item: {
      waitUntilTime: null,
      fieldToHarvest: null,
      fieldToSow: null,
      lookingFor: null,
    },
  };
  const farmChests = Object.values(config.fields)
    .map((field) => field.depositChests)
    .flat();
  const standByStateMachine = loadStandByStateMachine(
    bot,
    config.standByPosition,
    timeIn.minutes(1),
  );
  const behaviorCheckFields = new BehaviorCheckFields(
    bot,
    targets,
    config.fields,
  );
  const behaviorHarvestField = new BehaviorHarvestField(bot, targets);
  const behaviorWaitForDrops = new BehaviorWait(timeIn.seconds(2));
  behaviorWaitForDrops.stateName = 'Wait for Drops';
  const behaviorCheckHasSeeds = new BehaviorCheckInventory(
    bot,
    targets,
    (itemName) => {
      return itemName === targets.item.fieldToSow.seed;
    },
  );
  const behaviorCheckChestsForSeeds = new BehaviorCheckChests(
    bot,
    targets,
    farmChests,
  );
  const behaviorSowField = new BehaviorSowField(bot, targets);
  const behaviorDepositItems = new BehaviorDepositItems(
    bot,
    targets,
    farmChests,
  );
  const behaviorSowingCompleted = new BehaviorCompletedSowing(targets);
  const behaviorHarvestingCompleted = new BehaviorCompletedHarvesting(targets);

  const behaviorCheckHasItems = new BehaviorCheckInventory(
    bot,
    targets,
    (itemName) => {
      return farmChests
        .map((chest) => chest.items)
        .flat()
        .some((item) => item === itemName);
    },
  );
  const behaviorDepositCompleted = new BehaviorCompletedDeposit();

  const harvestingStateMachine = new NestedStateMachine(
    [
      new StateTransition({
        name: 'behaviorHarvestField => behaviorWaitForDrops',
        parent: behaviorHarvestField,
        child: behaviorWaitForDrops,
        shouldTransition: behaviorHarvestField.isFinished,
        onTransition: () => {
          console.info(
            'Transitioning: behaviorHarvestField => behaviorWaitForDrops',
          );
        },
      }),
      new StateTransition({
        name: 'behaviorWaitForDrops => behaviorHarvestingCompleted',
        parent: behaviorWaitForDrops,
        child: behaviorHarvestingCompleted,
        shouldTransition: behaviorWaitForDrops.isFinished,
        onTransition: () => {
          console.info(
            'Transitioning: behaviorWaitForDrops => behaviorHarvestingCompleted',
          );
        },
      }),
    ],
    behaviorHarvestField,
    behaviorHarvestingCompleted,
  );
  harvestingStateMachine.stateName = 'Harvest';

  const sowingStateMachine = new NestedStateMachine(
    [
      new StateTransition({
        name: 'behaviorCheckHasSeeds => behaviorSowField',
        parent: behaviorCheckHasSeeds,
        child: behaviorSowField,
        shouldTransition: behaviorCheckHasSeeds.hasItems,
        onTransition: () => {
          console.info(
            'Transitioning: behaviorCheckHasSeeds => behaviorSowField',
          );
        },
      }),
      new StateTransition({
        name: 'behaviorCheckHasSeeds => behaviorCheckChestsForSeeds',
        parent: behaviorCheckHasSeeds,
        child: behaviorCheckChestsForSeeds,
        shouldTransition: () => !behaviorCheckHasSeeds.hasItems(),
        onTransition: () => {
          console.info(
            'Transitioning: behaviorCheckHasSeeds => behaviorCheckChestsForSeeds',
          );

          targets.item.lookingFor = targets.item.fieldToSow.seed;
        },
      }),
      new StateTransition({
        name: 'behaviorCheckChestsForSeeds => behaviorSowField',
        parent: behaviorCheckChestsForSeeds,
        child: behaviorSowField,
        shouldTransition: () => {
          return (
            behaviorCheckChestsForSeeds.isFinished() &&
            behaviorCheckChestsForSeeds.foundItems()
          );
        },
        onTransition: () => {
          console.info(
            'Transitioning: behaviorCheckChestsForSeeds => behaviorSowField',
          );
        },
      }),
      new StateTransition({
        name: 'behaviorSowField => behaviorCheckChestsForSeeds',
        parent: behaviorSowField,
        child: behaviorCheckChestsForSeeds,
        shouldTransition: behaviorSowField.outOfSeeds,
        onTransition: () => {
          console.info(
            'Transitioning: behaviorSowField => behaviorCheckChestsForSeeds',
          );

          targets.item.lookingFor = targets.item.fieldToSow.seed;
        },
      }),
      new StateTransition({
        name: 'behaviorSowField => behaviorSowingCompleted',
        parent: behaviorSowField,
        child: behaviorSowingCompleted,
        shouldTransition: behaviorSowField.isFinished,
        onTransition: () => {
          console.info(
            'Transitioning: behaviorSowField => behaviorSowingCompleted',
          );
        },
      }),
      new StateTransition({
        name: 'behaviorCheckChestsForSeeds => behaviorSowingCompleted',
        parent: behaviorCheckChestsForSeeds,
        child: behaviorSowingCompleted,
        shouldTransition: () => {
          return (
            behaviorCheckChestsForSeeds.isFinished() &&
            !behaviorCheckChestsForSeeds.foundItems()
          );
        },
        onTransition: () => {
          console.info(
            'Transitioning: behaviorCheckChestsForSeeds => behaviorSowingCompleted',
          );
        },
      }),
    ],
    behaviorCheckHasSeeds,
    behaviorSowingCompleted,
  );
  sowingStateMachine.stateName = 'Sow';

  const depositItemsStateMachine = new NestedStateMachine(
    [
      new StateTransition({
        name: 'behaviorCheckHasItems => behaviorDepositItems',
        parent: behaviorCheckHasItems,
        child: behaviorDepositItems,
        shouldTransition: behaviorCheckHasItems.hasItems,
        onTransition: () => {
          console.info(
            'Transitioning: behaviorCheckHasItems => behaviorDepositItems',
          );
        },
      }),
      new StateTransition({
        name: 'behaviorCheckHasItems => behaviorDepositCompleted',
        parent: behaviorCheckHasItems,
        child: behaviorDepositCompleted,
        shouldTransition: () => !behaviorCheckHasItems.hasItems(),
        onTransition: () => {
          console.info(
            'Transitioning: behaviorCheckHasItems => behaviorDepositCompleted',
          );
        },
      }),
      new StateTransition({
        name: 'behaviorDepositItems => behaviorDepositCompleted',
        parent: behaviorDepositItems,
        child: behaviorDepositCompleted,
        shouldTransition: behaviorDepositItems.isFinished,
        onTransition: () => {
          console.info(
            'Transitioning: behaviorDepositItems => behaviorDepositCompleted',
          );
        },
      }),
    ],
    behaviorCheckHasItems,
    behaviorDepositCompleted,
  );
  depositItemsStateMachine.stateName = 'Deposit Items';

  const transitions = [
    new StateTransition({
      name: 'standByStateMachine => behaviorCheckFields',
      parent: standByStateMachine,
      child: behaviorCheckFields,
      shouldTransition: () => standByStateMachine.isFinished(),
      onTransition: () => {
        console.info(
          'Transitioning: standByStateMachine => behaviorCheckFields',
        );
      },
    }),
    new StateTransition({
      name: 'behaviorCheckFields => standByStateMachine',
      parent: behaviorCheckFields,
      child: standByStateMachine,
      shouldTransition: () => !behaviorCheckFields.shouldHarvest(),
      onTransition: () => {
        console.info(
          'Transitioning: behaviorCheckFields => standByStateMachine',
        );
      },
    }),
    new StateTransition({
      name: 'behaviorCheckFields => harvestStateMachine',
      parent: behaviorCheckFields,
      child: harvestingStateMachine,
      shouldTransition: behaviorCheckFields.shouldHarvest,
      onTransition: () => {
        console.info(
          'Transitioning: behaviorCheckFields => behaviorHarvestField',
        );
      },
    }),
    new StateTransition({
      name: 'harvestStateMachine => sowingStateMachine',
      parent: harvestingStateMachine,
      child: sowingStateMachine,
      shouldTransition: () => harvestingStateMachine.isFinished(),
      onTransition: () => {
        console.info(
          'Transitioning: harvestStateMachine => sowingStateMachine',
        );
      },
    }),
    new StateTransition({
      name: 'sowingStateMachine => depositItemsStateMachine',
      parent: sowingStateMachine,
      child: depositItemsStateMachine,
      shouldTransition: () => sowingStateMachine.isFinished(),
      onTransition: () => {
        console.info(
          'Transitioning: sowingStateMachine => depositItemsStateMachine',
        );
      },
    }),
    new StateTransition({
      name: 'depositItemsStateMachine => behaviorCheckFields',
      parent: depositItemsStateMachine,
      child: behaviorCheckFields,
      shouldTransition: () => depositItemsStateMachine.isFinished(),
      onTransition: () => {
        console.info(
          'Transitioning: depositItemsStateMachine => behaviorCheckFields',
        );
      },
    }),
  ];

  const farmingStateMachine = new NestedStateMachine(
    transitions,
    behaviorCheckFields,
  );
  farmingStateMachine.stateName = 'Farm';

  return farmingStateMachine;
};
