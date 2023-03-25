import { Bot } from 'mineflayer';
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine';
import { Item } from 'prismarine-item';
import { asyncTimeout } from '../helpers';

export class BehaviorCheckInventory implements StateBehavior {
  stateName: string = 'Check Inventory';
  active: boolean = false;
  finished: boolean = false;

  bot: Bot;
  targets: StateMachineTargets;
  filter?: (itemName: string) => boolean;

  constructor(
    bot: Bot,
    targets: StateMachineTargets,
    filter?: (itemName: string) => boolean,
  ) {
    this.bot = bot;
    this.targets = targets;
    this.filter = filter;
  }

  hasItems = () => {
    if (this.filter) {
      return this.bot.inventory.items().some(({ name }) => {
        return this.filter?.(name);
      });
    } else {
      return !!this.bot.inventory.items().length;
    }
  };
}
