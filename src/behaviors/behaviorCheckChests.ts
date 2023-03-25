import { Bot } from 'mineflayer';
import { goals } from 'mineflayer-pathfinder';
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine';
import { Vec3 } from 'vec3';
import { BotChest } from '../types';

export class BehaviorCheckChests implements StateBehavior {
  stateName: string = 'Check Chests';
  active: boolean = false;

  bot: Bot;
  targets: StateMachineTargets;
  chests: BotChest[];

  finished: boolean = false;
  itemsFound: boolean = false;

  constructor(bot: Bot, targets: StateMachineTargets, chests: BotChest[]) {
    this.bot = bot;
    this.targets = targets;
    this.chests = chests;
  }

  onStateEntered = async () => {
    this.finished = false;
    this.itemsFound = false;

    const chestsWithItem = this.chests.filter((chest) => {
      return chest.items?.some((item) => item === this.targets.item.lookingFor);
    });

    for (const chest of chestsWithItem) {
      await this.bot.pathfinder.goto(new goals.GoalNear(...chest.position, 1));

      const chestToOpen = this.bot.blockAt(new Vec3(...chest.position));

      if (chestToOpen) {
        const openedChest = await this.bot.openContainer(chestToOpen);

        const chestItemCount = openedChest
          .containerItems()
          .reduce((count, item) => {
            if (item.name === this.targets.item.lookingFor) {
              return count + item.count;
            }

            return count;
          }, 0);

        await openedChest.withdraw(
          this.bot.registry.itemsByName[this.targets.item.lookingFor].id,
          null,
          chestItemCount,
        );

        openedChest.close();
      }
    }

    const itemInInventory = this.bot.inventory
      .items()
      .some((item) => item.name === this.targets.item.lookingFor);

    if (itemInInventory) {
      this.itemsFound = true;
    }

    this.finished = true;
  };

  onStateExited = () => {
    this.targets.item.lookingFor = null;
  };

  isFinished = () => {
    return this.finished;
  };

  foundItems = () => {
    return this.finished && this.itemsFound;
  };
}
