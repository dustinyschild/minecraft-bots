import { BotOptions } from 'mineflayer';
import { BotBase } from '../BotBase';
import { loadCarrierConfig } from '../configs';
import { loadCarrierStateMachine } from '../state_machines/carrier';

/* for bulk item transport */
export class BotCarrier extends BotBase {
  stateMachine;

  constructor(options: BotOptions) {
    super(options);

    const config = loadCarrierConfig(options.username);

    this.stateMachine = this.loadStateMachines([
      loadCarrierStateMachine(this.bot, config),
    ]);

    this.bot.on('spawn', () => {});
  }
}
