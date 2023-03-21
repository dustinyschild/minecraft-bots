import { Bot } from 'mineflayer';
import { goals } from 'mineflayer-pathfinder';
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine';
import { Vec3 } from 'vec3';
import { crops } from '../config';
import { asyncTimeout } from '../helpers';
import { Field } from '../types/farmer';

export class BehaviorStoreItems implements StateBehavior {
  stateName: string = 'Store Item';
  active: boolean = false;

  bot: Bot;
  targets: StateMachineTargets;

  finished: boolean = false;

  constructor(bot: Bot, targets: StateMachineTargets) {
    this.bot = bot;
    this.targets = targets;
  }

  onStateEntered = async () => {
    this.finished = false;

    await this.store(this.targets.item.fieldToHarvest as Field);

    this.finished = true;
  };

  // reset targeted field
  onStateExited = () => {
    this.targets.item.fieldToHarvest = null;
  };

  store = async (field: Field) => {
    await this.bot.pathfinder.goto(new goals.GoalNear(...field.yieldChest, 1));

    const yieldChestToOpen = this.bot.blockAt(new Vec3(...field.yieldChest));
    if (yieldChestToOpen) {
      const openChest = await this.bot.openContainer(yieldChestToOpen);

      await asyncTimeout(350);

      // total inventory minus number of seeds needed for replanting
      const totalInventoryCount = this.bot.inventory
        .items()
        .filter((item) => item.type === crops[field.crop].yieldItem)
        .reduce((total, item) => (total += item.count), 0);

      await openChest.deposit(
        crops[field.crop].yieldItem,
        null,
        totalInventoryCount,
      );

      await asyncTimeout(350);

      openChest.close();
    }

    const seedsChestToOpen = this.bot.blockAt(new Vec3(...field.seedChest));
    if (seedsChestToOpen) {
      const openChest = await this.bot.openContainer(seedsChestToOpen);

      const totalInventoryCount = this.bot.inventory
        .items()
        .filter((item) => item.type === crops[field.crop].sowableItem)
        .reduce((total, item) => (total += item.count), 0);

      await openChest.deposit(
        crops[field.crop].sowableItem,
        null,
        totalInventoryCount,
      );

      openChest.close();
    }

    // potatoes only
    const discardItem = crops[field.crop].discardItem;
    if (discardItem && field.discardChest) {
      const discardChestToOpen = this.bot.blockAt(
        new Vec3(...field.discardChest),
      );
      if (discardChestToOpen) {
        const openChest = await this.bot.openContainer(discardChestToOpen);

        const totalInventoryCount = this.bot.inventory
          .items()
          .filter((item) => item.type === discardItem)
          .reduce((total, item) => (total += item.count), 0);

        await openChest.deposit(discardItem, null, totalInventoryCount);

        openChest.close();
      }
    } else if (crops[field.crop].discardItem && !field.discardChest) {
      console.log('No discard chest provided');
    }
  };

  isFinished = () => this.finished;
}
