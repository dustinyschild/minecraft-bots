import { Bot, BotOptions, createBot } from 'mineflayer';
import mcDataLoader, { IndexedData } from 'minecraft-data';
import { pathfinder, goals, Movements } from 'mineflayer-pathfinder';
import { Vec3 } from 'vec3';
import { registerCommands } from '../modules/chat';
import { writeFile } from 'fs/promises';
import { loadSorterConfig } from '../configs';
import { Coordinate } from '../types';
import {
  BehaviorIdle,
  BotStateMachine,
  NestedStateMachine,
  StateTransition,
} from 'mineflayer-statemachine';

export class BotSorter {
  bot: Bot;
  mcData: IndexedData;
  stateMachine: BotStateMachine;
  standByPosition: Coordinate;
  withdrawalPosition: Coordinate;
  depositChests: {
    position: [number, number, number];
    itemName: string;
  }[];
  withdrawalChestOpen: boolean = false;
  isSorting: boolean = false;
  shouldCheckChest: boolean = false;

  constructor(options: BotOptions) {
    this.bot = createBot(options);
    this.mcData = mcDataLoader(this.bot.version);

    this.bot.loadPlugin(pathfinder);
    const defaultMove = new Movements(this.bot, this.mcData);
    this.bot.pathfinder.setMovements(defaultMove);

    // will error if config can't be found.
    const config = loadSorterConfig(options.username);

    this.standByPosition = config.standByPosition;
    this.withdrawalPosition = config.withdrawalPosition;
    this.depositChests = config.depositChests;

    // placeholder
    const behaviorIdle = new BehaviorIdle();
    behaviorIdle.stateName = 'Idle';

    const rootStateMachine = new NestedStateMachine([], behaviorIdle);
    rootStateMachine.stateName = 'Root';

    this.stateMachine = new BotStateMachine(this.bot, rootStateMachine);

    this.bot.once('spawn', async () => {
      registerCommands(this.bot, {
        sort: this.sort,
        addDeposit: async ([itemName, ...coords]) => {
          const [x, y, z] = coords.map(parseInt);

          if (this.bot.blockAt(new Vec3(x, y, z))?.name === 'air') {
            this.depositChests.push({
              position: [x, y, z],
              itemName,
            });
          } else {
            this.bot.chat(
              `Cannot register chest: [${x}, ${y}, ${z}] is occupied.`,
            );
          }

          // rewrite file with new config values
          await writeFile(
            './src/configs/sorter.json',
            JSON.stringify({
              withdrawalPosition: this.withdrawalPosition,
              depositChests: this.depositChests,
            }),
          );

          this.bot.chat(
            `New deposit chest for item '${itemName}' at [${x}, ${y}, ${z}]`,
          );
        },
      });
      this.bot.on('chestLidMove', (block, isOpen) => {
        const { x, y, z } = block.position;
        const [withdrawalX, withdrawalY, withdrawZ] = this.withdrawalPosition;
        if (
          x === withdrawalX &&
          y === withdrawalY &&
          z === withdrawZ &&
          isOpen === 0 &&
          !this.withdrawalChestOpen
        ) {
          if (this.isSorting) {
            this.shouldCheckChest = true;
          } else {
            this.sort();
          }
        }
      });

      this.bot.on('chat', async (username, message) => {
        if (message === 'sort') {
          await this.sort();
        }
      });
    });
  }

  sort = async () => {
    this.isSorting = true;
    await this.bot.pathfinder.goto(
      new goals.GoalNear(...this.withdrawalPosition, 1),
    );
    await this.withdrawal();
    for (let chest of this.depositChests) {
      const hasItem = this.bot.inventory.items().some((item) => {
        return item.name === chest.itemName;
      });
      if (hasItem) {
        await this.bot.pathfinder.goto(
          new goals.GoalNear(...chest.position, 3),
        );
        await this.deposit(chest.position, chest.itemName);
      }
    }

    await this.bot.pathfinder.goto(
      new goals.GoalBlock(...this.standByPosition),
    );
    this.isSorting = false;
  };

  withdrawal = async () => {
    const chestToOpen = this.bot.blockAt(new Vec3(...this.withdrawalPosition));
    if (chestToOpen) {
      this.withdrawalChestOpen = true;
      const withdrawalChest = await this.bot.openContainer(chestToOpen);
      const chestItems = withdrawalChest.containerItems();
      for (let item of chestItems) {
        await withdrawalChest.withdraw(item.type, null, item.count);
      }
      withdrawalChest.close();
      this.withdrawalChestOpen = false;
    }
  };

  deposit = async (
    depositPosition: [number, number, number],
    itemName: string,
  ) => {
    const chestToOpen = this.bot.blockAt(new Vec3(...depositPosition));
    if (chestToOpen) {
      const depositChest = await this.bot
        .openContainer(chestToOpen)
        .catch(() => {
          this.bot.chat(`There is no chest at ${depositPosition}`);
        });
      const inventoryItems = this.bot.inventory.items().filter((item) => {
        return item.name === itemName;
      });

      if (depositChest) {
        for (let item of inventoryItems) {
          await depositChest.deposit(item.type, null, item.count);
        }
        depositChest.close();
      }
    }
  };
}
