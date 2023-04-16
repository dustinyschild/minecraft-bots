import { Bot } from 'mineflayer';
import { Movements, goals } from 'mineflayer-pathfinder';
import { StateBehavior } from 'mineflayer-statemachine';
import { Vec3 } from 'vec3';
import mcDataLoader from 'minecraft-data';

export class BehaviorStandBy implements StateBehavior {
  stateName: string = 'Stand By';
  active: boolean = false;

  private readonly bot: Bot;
  movements: Movements;

  position: Vec3;
  finished: boolean;

  constructor(bot: Bot, position: Vec3) {
    this.bot = bot;

    const mcData = mcDataLoader(bot.version);
    this.movements = new Movements(bot, mcData);

    this.position = position;
    this.finished = false;
  }

  onStateEntered = () => {
    const { x, y, z } = this.position;
    this.finished = false;

    this.bot.pathfinder
      .goto(new goals.GoalBlock(x, y, z))
      .then(async () => {
        return this.bot.look(270 * (Math.PI / 180), 0);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        this.finished = true;
      });
  };

  isFinished = () => this.finished;
}
