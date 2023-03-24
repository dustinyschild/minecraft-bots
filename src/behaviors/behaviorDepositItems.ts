import { Bot } from 'mineflayer';
import { goals } from 'mineflayer-pathfinder';
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine';
import { Vec3 } from 'vec3';
import { DepositChest } from '../types';

export class BehaviorDepositItems implements StateBehavior {
  stateName: string = 'Check Chests';
  active: boolean = false;
  finished: boolean = false;

  bot: Bot;
  targets: StateMachineTargets;
  chests: DepositChest[];

  constructor(bot: Bot, targets: StateMachineTargets, chests: DepositChest[]) {
    this.bot = bot;
    this.targets = targets;
    this.chests = chests;
  }

  onStateEntered = async () => {
    this.finished = false;

    for (const chest of this.chests) {
      if (!this.hasItemsToDeposit(chest)) {
        continue;
      }

      const [x, y, z] = chest.position;
      const block = this.bot.blockAt(new Vec3(x, y, z));

      if (!block || block.name !== 'chest') {
        console.warn(`No chest at position [${x}, ${y}, ${z}]`);
        continue;
      }

      await this.bot.pathfinder.goto(new goals.GoalNear(x, y, z, 1));

      const openedChest = await this.bot.openContainer(block);

      for (const item of this.bot.inventory.items()) {
        if (chest.items.some((itemName) => itemName === item.name)) {
          await openedChest.deposit(item.type, null, item.count).catch(() => {
            // suppress failed deposit errors
          });
        }
      }

      openedChest.close();
    }

    this.finished = true;
  };

  hasItemsToDeposit = (chest: DepositChest) => {
    const hasItemsToDeposit = this.bot.inventory.items().some((item) => {
      return chest.items.some((chestItem) => {
        return chestItem === item.name;
      });
    });

    return hasItemsToDeposit;
  };

  // error cases?
  // no chests provided
  // no blocks are chests

  isFinished = () => this.finished;
}
