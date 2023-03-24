import { Bot } from 'mineflayer';
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine';
import { Item } from 'prismarine-item';

export class BehaviorCheckInventory implements StateBehavior {
  stateName: string = 'Check Inventory';
  active: boolean = false;

  bot: Bot;
  targets: StateMachineTargets;
  filter?: (itemName: string) => boolean;

  inventory: Item[] = [];

  constructor(
    bot: Bot,
    targets: StateMachineTargets,
    filter?: (itemName: string) => boolean,
  ) {
    this.bot = bot;
    this.targets = targets;
    this.filter = filter;
  }

  onStateEntered = () => {
    this.inventory = this.bot.inventory.items();
  };

  hasItems = () => {
    if (this.filter) {
      return this.inventory.some(({ name }) => this.filter?.(name));
    } else {
      return !!this.inventory.length;
    }
  };
}
