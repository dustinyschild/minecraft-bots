import { BotOptions } from 'mineflayer';
import { loadFarmerConfig } from '../configs';
import { IFarmer, IField } from '../types/farmer';
import { loadFarmingStateMachine } from '../state_machines/farmer';
import { BotBase } from '../BotBase';
import { IServer } from '../types';

export class BotFarmer extends BotBase {
  debugMode: boolean;
  fields: IField[];
  isFarming: boolean;
  harvestThreshold: number;
  stateMachine;

  constructor({ host, port, version }: IServer, config: IFarmer) {
    super({
      username: config.username,
      host,
      port,
      version,
    });

    this.debugMode = true;

    this.isFarming = false;
    this.harvestThreshold = 0.5;

    this.stateMachine = this.loadStateMachines([
      loadFarmingStateMachine(this.bot, config),
    ]);

    this.fields = config.fields;

    this.bot.once('spawn', () => {
      // trigger farming enter state
      setTimeout(
        () =>
          this.stateMachine.transitions
            .find((transition) => {
              return transition.name === 'behaviorIdle => Farm';
            })
            ?.trigger(),
        3000,
      );
    });
  }
}
