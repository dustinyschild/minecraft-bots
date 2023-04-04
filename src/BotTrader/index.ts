import {
  BehaviorIdle,
  BotStateMachine,
  NestedStateMachine,
} from 'mineflayer-statemachine';
import { BotBase } from '../BotBase';
import { BotOptions } from 'mineflayer';
import { goals } from 'mineflayer-pathfinder';

export class BotTrader extends BotBase {
  stateMachine = new BotStateMachine(
    this.bot,
    new NestedStateMachine([], new BehaviorIdle()),
  );

  constructor(options: BotOptions) {
    super(options);
    this.bot.once('spawn', async () => {
      // this.bot.on('time', () => {
      //   if (this.bot.time.timeOfDay >= 0 && this.bot.time.timeOfDay < 20) {
      //     console.log('time to get crackin');
      //   }
      // });

      await this.checkForAvailableItems();
    });
  }

  checkForAvailableItems = async () => {
    const villagers = Object.values(this.bot.entities).filter((entity) => {
      return entity.mobType === 'Villager';
    });

    for (const villager of villagers) {
      const { x, y, z } = villager.position;
      await this.bot.pathfinder.goto(new goals.GoalNear(x, y, z, 3));

      const villagerWindow = await this.bot.openVillager(villagers[0]);
      const availableTrades = villagerWindow.trades
        .filter((trade) => {
          return !trade.tradeDisabled && trade.outputItem.name === 'emerald';
        })
        .forEach((trade) => {
          console.log(trade.inputItem1, trade.inputItem2);
        });

      villagerWindow.close();
    }
  };
}
