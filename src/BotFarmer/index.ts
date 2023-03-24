import { BotOptions } from 'mineflayer';
import { loadFarmerConfig } from '../configs';
import { Field } from '../types/farmer';
import { loadFarmingStateMachine } from '../state_machines/farmer';
import { BotBase } from '../BotBase';

export class BotFarmer extends BotBase {
  debugMode: boolean;
  fields: Field[];
  isFarming: boolean;
  harvestThreshold: number;
  stateMachine;

  constructor(options: BotOptions) {
    super(options);

    this.debugMode = true;

    this.isFarming = false;
    this.harvestThreshold = 0.5;

    const config = loadFarmerConfig(options.username);

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
