import { IFarmer, IField } from '../types/farmer';
import { loadFarmingStateMachine } from '../modules/state_machines/farmer';
import { BotBase } from '../BotBase';
import { IServer } from '../types';
import { BotDocument, Farmer } from '../modules/db/models';
import { goals } from 'mineflayer-pathfinder';
import { Vec3 } from 'vec3';
import { cacheChests } from '../modules/cache';

export class BotFarmer extends BotBase {
  config: IFarmer;

  fields: IField[];
  isFarming: boolean;
  harvestThreshold: number;
  stateMachine;

  constructor(server: IServer, config: BotDocument<IFarmer>) {
    const { username } = config;
    const { host, port, version } = server;

    super({
      username,
      host,
      port,
      version,
    });

    this.config = config;

    this.isFarming = false;
    this.harvestThreshold = 0.5;

    this.stateMachine = this.loadStateMachines([
      // loadFarmingStateMachine(this.bot, config),
    ]);

    this.fields = config.fields;

    this.bot.once('spawn', async () => {
      this.loadCommands();

      // trigger farming enter state
      // setTimeout(
      //   () =>
      //     this.stateMachine.transitions
      //       .find((transition) => {
      //         return transition.name === 'behaviorIdle => Farm';
      //       })
      //       ?.trigger(),
      //   3000,
      // );
      // await cacheChests.add('wheatYield', 'yield', [-14, -60, 35], ['wheat']);

      await this.getChestContents();
    });
  }

  getChestContents = async () => {
    await this.bot.pathfinder.goto(new goals.GoalNear(-14, -60, 35, 2));

    const chestBlock = this.bot.blockAt(new Vec3(-14, -60, 35));

    if (chestBlock) {
      const openedChest = await this.bot.openContainer(chestBlock);

      const contents = openedChest.containerItems().map((item) => item);

      await cacheChests.update('wheatYield', { contents });

      openedChest.close();
    }

    console.log(await cacheChests.findOne('wheatYield'));
  };
}
