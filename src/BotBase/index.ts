import { Bot, BotOptions, createBot } from 'mineflayer';
import mcDataLoader, { IndexedData } from 'minecraft-data';
import { pathfinder, Movements, goals } from 'mineflayer-pathfinder';
import { Vec3 } from 'vec3';
import { BotCommandDictionary } from '../types';
import {
  loadBlockCommands,
  loadChatCommands,
  loadEntityCommands,
  loadItemCommands,
  loadMovementCommands,
  loadSelfCommands,
  parseCommand,
} from '../modules/commands';
import {
  BehaviorIdle,
  BotStateMachine,
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

  loadCommands = (additionalCommands?: BotCommandDictionary) => {
    const commands: BotCommandDictionary = {
      ...loadChatCommands(this.bot),
      ...loadBlockCommands(this.bot),
      ...loadItemCommands(this.bot),
      ...loadEntityCommands(this.bot),
      ...loadMovementCommands(this.bot),
      ...loadSelfCommands(this.bot),
      sleep: this.sleep,
      ...(additionalCommands || {}),
    };

    this.bot.on('whisper', (username, message) => {
      const { command, commandArgs } = parseCommand(username, message);
      console.log(message, commands[command]);

      commands[command]?.(username, commandArgs);
    });
  };

  /** Methods */
  sleep = async () => {
    await this.bot.pathfinder.goto(new goals.GoalNear(-13, -60, 32, 1));

    const bedBlock = this.bot.blockAt(new Vec3(-13, -60, 32));
    if (bedBlock && this.bot.isABed(bedBlock)) {
      await this.bot.sleep(bedBlock).catch(() => {
        console.log("Can't sleep now");
      });
    }
  };
}
