import { Bot, BotOptions, createBot } from 'mineflayer';
import { pathfinder } from 'mineflayer-pathfinder';
import mcDataLoader, { IndexedData } from 'minecraft-data';
import { loadFarmerConfig } from '../configs';
import { Field } from '../types/farmer';
import {
  BehaviorIdle,
  BotStateMachine,
  NestedStateMachine,
  StateMachineWebserver,
  StateTransition,
} from 'mineflayer-statemachine';
import { loadFarmingStateMachine } from '../state_machines/farming';
import { BotBase } from '../BotBase';

export class BotFarmer extends BotBase {
  debugMode: boolean;
  fields: Field[];
  isFarming: boolean;
  harvestThreshold: number;
  stateMachine: BotStateMachine;
  stateMachineServer: StateMachineWebserver;

  constructor(options: BotOptions) {
    super(options);

    this.debugMode = true;

    this.isFarming = false;
    this.harvestThreshold = 0.5;

    const config = loadFarmerConfig(options.username);

    const behaviorIdle = new BehaviorIdle();
    behaviorIdle.stateName = 'Idle';

    const farmingStateMachine = loadFarmingStateMachine(this.bot, config);
    farmingStateMachine.stateName = 'Farm';

    const rootStateMachine = new NestedStateMachine(
      [
        // behaviorIdle => behaviorCheckFields
        new StateTransition({
          parent: behaviorIdle,
          child: farmingStateMachine,
        }),
      ],
      behaviorIdle,
    );
    rootStateMachine.stateName = 'Root';
    this.stateMachine = new BotStateMachine(this.bot, rootStateMachine);
    this.stateMachineServer = new StateMachineWebserver(
      this.bot,
      this.stateMachine,
    );
    this.stateMachineServer.startServer();

    this.fields = config.fields;
  }
}
