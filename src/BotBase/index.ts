import { Bot, BotOptions, createBot } from 'mineflayer';
import mcDataLoader, { IndexedData } from 'minecraft-data';
import { pathfinder, Movements, goals } from 'mineflayer-pathfinder';
import { Vec3 } from 'vec3';
import { ItemRegistry } from '../types';
import { registerCommands } from '../modules/chat';
import { Entity } from 'prismarine-entity';
import {
  BehaviorIdle,
  BotStateMachine,
  EntityFilters,
  NestedStateMachine,
  StateTransition,
} from 'mineflayer-statemachine';

export abstract class BotBase {
  bot: Bot;
  mcData: IndexedData;
  movements: Movements;
  abstract stateMachine: BotStateMachine;

  constructor(options: BotOptions) {
    this.bot = createBot(options);
    this.mcData = mcDataLoader(this.bot.version);

    this.bot.loadPlugin(pathfinder);

    this.movements = new Movements(this.bot, this.mcData);

    this.bot.once('spawn', async () => {
      console.log(`${this.bot.username} joined ${options.host}`);

      registerCommands(this.bot, {
        say: (_username, commandArgs) => {
          this.bot.chat(commandArgs.join(' '));
        },
        block: (_username, [blockName]) => {
          console.log(this.bot.registry.blocksByName[blockName]);
        },
        blocksLike: (_username, [searchText]) => {
          Object.keys(this.bot.registry.blocksByName)
            .filter((key) => key.includes(searchText))
            .map((match) => console.log(match));
        },
        blockAt: (_username, [x, y, z]) => {
          console.log(
            this.bot.blockAt(new Vec3(parseInt(x), parseInt(y), parseInt(z))),
          );
        },
        item: (_username, [itemName]) => {
          console.log(this.bot.registry.itemsByName[itemName]);
        },
        itemsLike: (_username, [searchText]) => {
          Object.keys(this.bot.registry.itemsByName)
            .filter((key) => key.includes(searchText))
            .map((match) => console.log(match));
        },
        itemById: (_username, [id]) => {
          const item = Object.values(
            this.bot.registry.itemsByName as ItemRegistry,
          ).find((item: any) => item.id === parseInt(id));

          console.log(item);
        },
        getDrops: () => {
          Object.values(this.bot.entities)
            .filter((e) => e.entityType === 45)
            .forEach((e) => {
              const entityItem = e.metadata[8] as any;

              const itemName = Object.values(
                this.bot.registry.itemsByName as ItemRegistry,
              ).find((item: any) => item.id === entityItem.itemId)?.name;

              console.log(
                e.position.distanceTo(this.bot.entity.position),
                this.bot.registry.itemsByName[itemName],
              );
            });
        },
        entities: () => {
          console.log(this.bot.entities);
        },
        entity: (_username, [id]) => {
          console.log(this.bot.entities[id]);
        },
        self: (_username, [property]) => {
          if (property) {
            const [, prop] = Object.entries(this.bot.entity).find(
              ([prop]) => prop === property,
            ) as [string, Entity];

            console.log(prop);
          } else {
            console.log(this.bot.entity);
          }
        },
        sleep: this.sleep,
        come: (username) => {
          const player = Object.values(this.bot.entities).find((entity) => {
            return (
              EntityFilters().PlayersOnly(entity) &&
              entity.username === username
            );
          });

          if (player) {
            const { x, y, z } = player.position;
            this.bot.pathfinder.goto(new goals.GoalNear(x, y, z, 1));
          } else {
            this.bot.whisper(username, 'Out of range.');
          }
        },
      });
    });
  }

  loadStateMachines = (stateMachines: NestedStateMachine[]) => {
    // root state machine
    const behaviorIdle = new BehaviorIdle();
    behaviorIdle.stateName = 'Idle';

    const rootStateMachine = new NestedStateMachine(
      stateMachines.map((stateMachine) => {
        return new StateTransition({
          name: `behaviorIdle => ${stateMachine.stateName}`,
          parent: behaviorIdle,
          child: stateMachine,
          onTransition: () =>
            console.log(
              `Transitioning: behaviorIdle => ${stateMachine.stateName}`,
            ),
        });
      }),
      behaviorIdle,
    );
    rootStateMachine.stateName = 'Root';

    return new BotStateMachine(this.bot, rootStateMachine);
  };

  sleep = async () => {
    await this.bot.pathfinder.goto(new goals.GoalNear(3, -60, -15, 2));

    const bedBlock = this.bot.findBlock({
      matching: (block) => this.bot.isABed(block),
    });

    if (bedBlock) {
      await this.bot.sleep(bedBlock).catch((err) => {
        console.error(err);
      });
    }
  };
}
