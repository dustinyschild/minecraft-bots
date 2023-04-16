import { Bot } from 'mineflayer';
import {
  NestedStateMachine,
  StateMachineTargets,
  StateTransition,
} from 'mineflayer-statemachine';
import { Item } from 'prismarine-item';
import { Job } from 'bullmq';
import { BotChest } from '../../types';
import {
  BehaviorWait,
  BehaviorCheckInventory,
  BehaviorDepositItems,
} from './behaviors';

interface TransportOptions {
  waitTime: number;
}

interface TransportTargets extends StateMachineTargets {
  item: {
    currentInventory: Item[] | null;
    targetChest: BotChest | null;
  };
}

export class TransportJob {
  job: Job | null = null;
  markComplete: ((value: unknown) => void) | null = null;
  markFailed: ((value: unknown) => void) | null = null;
  stateMachine: NestedStateMachine;
  targets: TransportTargets = {
    item: {
      currentInventory: null,
      targetChest: null,
    },
  };

  constructor(bot: Bot, depositChests: BotChest[], config: TransportOptions) {
    this.stateMachine = loadTransportStateMachine(bot, depositChests, config);
  }

  processor = async (job: Job) => {
    this.job = job;

    await new Promise((resolve, reject) => {
      this.markComplete = resolve;
      this.markFailed = reject;
    });
  };

  completeJob = () => {
    this.job = null;
    this.markComplete?.(null);
  };

  failJob = () => {
    this.job = null;
    this.markFailed?.(null);
  };
}

export const loadTransportStateMachine = (
  bot: Bot,
  depositChests: BotChest[],
  config: TransportOptions,
) => {
  const targets: StateMachineTargets = {
    item: {
      currentInventory: null,
      targetChest: null,
    },
  };

  const behaviorWait = new BehaviorWait(config.waitTime);
  const behaviorCheckInventory = new BehaviorCheckInventory(bot, targets);
  const behaviorDepositItems = new BehaviorDepositItems(
    bot,
    targets,
    depositChests,
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
  carrierStateMachine.stateName = 'Transport';

  return carrierStateMachine;
};
