import { Bot } from 'mineflayer';
import {
  StateMachineTargets,
  BehaviorIdle,
  StateTransition,
  NestedStateMachine,
} from 'mineflayer-statemachine';
import { Vec3 } from 'vec3';
import {
  BehaviorWait,
  BehaviorStandBy,
  BehaviorCheckFields,
  BehaviorHarvestField,
  BehaviorSowField,
  BehaviorStoreItems,
} from '../behaviors';
import { crops } from '../config';
import { timeIn } from '../helpers';
import { FarmerConfig } from '../types/farmer';

export const loadFarmingStateMachine = (bot: Bot, config: FarmerConfig) => {
  const targets: StateMachineTargets = {
    item: {
      waitUntilTime: null,
      fieldToHarvest: null,
      crops,
    },
  };

  const behaviorWait = new BehaviorWait(timeIn.seconds(3));
  behaviorWait.stateName = 'Wait';
  const behaviorStandBy = new BehaviorStandBy(bot, new Vec3(-15, -60, -6));

  const behaviorCheckFields = new BehaviorCheckFields(
    bot,
    targets,
    config.fields,
  );
  const behaviorHarvestField = new BehaviorHarvestField(bot, targets);
  const behaviorSowField = new BehaviorSowField(bot, targets);
  const behaviorStoreItems = new BehaviorStoreItems(bot, targets);

  const transitions: StateTransition[] = [
    // behaviorCheckFields => behaviorWait
    new StateTransition({
      parent: behaviorCheckFields,
      child: behaviorWait,
      shouldTransition: () =>
        bot.entity.position.distanceTo(behaviorStandBy.position) < 1,
    }),
    // behaviorCheckFields => behaviorStandBy
    new StateTransition({
      parent: behaviorCheckFields,
      child: behaviorStandBy,
      shouldTransition: () => !targets.item.fieldToHarvest,
    }),
    // behaviorCheckFields => behaviorHarvestField
    new StateTransition({
      parent: behaviorCheckFields,
      child: behaviorHarvestField,
      shouldTransition: () => targets.item.fieldToHarvest,
    }),
    // behaviorHarvestField => behaviorSowField
    new StateTransition({
      parent: behaviorHarvestField,
      child: behaviorSowField,
      shouldTransition: behaviorHarvestField.isFinished,
    }),
    // behaviorSowField => behaviorStoreItems
    new StateTransition({
      parent: behaviorSowField,
      child: behaviorStoreItems,
      shouldTransition: behaviorSowField.isFinished,
    }),
    // behaviorStoreItems => behaviorCheckFields
    new StateTransition({
      parent: behaviorStoreItems,
      child: behaviorCheckFields,
      shouldTransition: behaviorStoreItems.isFinished,
    }),
    // behaviorStandBy => behaviorWait
    new StateTransition({
      parent: behaviorStandBy,
      child: behaviorWait,
      shouldTransition: behaviorStandBy.isFinished,
    }),
    // behaviorWait => behaviorCheckFields
    new StateTransition({
      parent: behaviorWait,
      child: behaviorCheckFields,
      shouldTransition: behaviorWait.isFinished,
    }),
  ];

  const farmingStateMachine = new NestedStateMachine(
    transitions,
    behaviorCheckFields,
  );
  farmingStateMachine.stateName = 'Farm';

  return farmingStateMachine;
};
