import { Bot } from 'mineflayer';
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine';
// import { Movements } from 'mineflayer-pathfinder';
// import mcDataLoader from 'minecraft-data';

/**
 * The bot will look at the target entity.
 */
export class BehaviorFollowPlayer implements StateBehavior {
  private readonly bot: Bot;

  readonly targets: StateMachineTargets;
  // movements: Movements;
  stateName: string = 'followPlayer';
  active: boolean = false;
  x?: number;
  y?: number;
  distance: number = 2;

  constructor(bot: Bot, targets: StateMachineTargets) {
    this.bot = bot;
    this.targets = targets;

    // const mcData = mcDataLoader(bot.version);
    // this.movements = new Movements(bot, mcData);
  }

  update(): void {
    const player = this.targets.player?.entity;
    if (player != null) {
      this.bot
        .lookAt(player.position.offset(0, player.height, 0))
        .then(() => {
          if (this.distanceToTarget() > 2) {
            this.bot.setControlState('forward', true);
          } else {
            this.bot.clearControlStates();
          }
        })
        .catch((err) => {
          console.log(err);
          this.bot.clearControlStates();
        });
    }
  }

  /**
   * Gets the distance to the target entity.
   *
   * @returns The distance, or 0 if no target entity is assigned.
   */
  distanceToTarget(): number {
    const player = this.targets.player?.entity;
    if (player == null) return 0;

    return this.bot.entity.position.distanceTo(player.position);
  }
}
