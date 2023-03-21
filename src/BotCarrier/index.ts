import { BotOptions } from 'mineflayer';
import { Vec3 } from 'vec3';
import { BotBase } from '../BotBase';
import { loadCarrierConfig } from '../configs';
import { Coordinate } from '../types';

/* for bulk item transport */

export class BotCarrier extends BotBase {
  standByPosition: Coordinate;
  withdrawalChests: Coordinate[];
  depositChest: Coordinate;

  constructor(options: BotOptions) {
    super(options);

    const config = loadCarrierConfig(options.username);

    this.standByPosition = config.standByPosition;
    this.withdrawalChests = config.withdrawalChests;
    this.depositChest = config.depositChest;

    this.bot.on('spawn', () => {
      this.bot.on('chat', (_username, message) => {
        if (message === 'check') {
          this.checkWithdrawalChests();
        }
      });
    });
  }

  checkWithdrawalChests = () => {
    this.withdrawalChests.forEach((position) => {
      const chest = this.bot.blockAt(new Vec3(...position));

      console.log(chest);
    });
  };
}
