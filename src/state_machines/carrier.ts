import { Bot } from 'mineflayer';
import {
  NestedStateMachine,
  StateMachineTargets,
  StateTransition,
} from 'mineflayer-statemachine';
import {
  BehaviorDepositItems,
  BehaviorCheckInventory,
  BehaviorWait,
} from '../behaviors';
import { timeIn } from '../helpers';
import { CarrierConfig } from '../types/carier';

export const loadCarrierStateMachine = (bot: Bot, config: CarrierConfig) => {
  const targets: StateMachineTargets = {
    item: {
      currentInventory: null,
      targetChest: null,
    },
  };

  const behaviorWait = new BehaviorWait(timeIn.seconds(10));
  const behaviorCheckInventory = new BehaviorCheckInventory(bot, targets);
  const behaviorDepositItems = new BehaviorDepositItems(
    bot,
    targets,
    config.depositChests,
  );

  const transitions: StateTransition[] = [
    // behaviorWait => behaviorCheckInventory
    new StateTransition({
      parent: behaviorWait,
      child: behaviorCheckInventory,
      shouldTransition: behaviorWait.isFinished,
    }),
    // behaviorCheckInventory => behaviorDepositItems
    new StateTransition({
      parent: behaviorCheckInventory,
      child: behaviorDepositItems,
      shouldTransition: behaviorCheckInventory.hasItems,
    }),
    // behaviorDepositItems => behaviorWait
    new StateTransition({
      parent: behaviorDepositItems,
      child: behaviorWait,
      shouldTransition: behaviorDepositItems.isFinished,
    }),
  ];

  const carrierStateMachine = new NestedStateMachine(
    transitions,
    behaviorCheckInventory,
  );
  carrierStateMachine.stateName = 'Transporting';

  return carrierStateMachine;
};
