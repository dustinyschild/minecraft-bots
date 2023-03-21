"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BehaviorFollowPlayer = void 0;
// import { Movements } from 'mineflayer-pathfinder';
// import mcDataLoader from 'minecraft-data';
/**
 * The bot will look at the target entity.
 */
class BehaviorFollowPlayer {
    constructor(bot, targets) {
        // movements: Movements;
        this.stateName = 'followPlayer';
        this.active = false;
        this.distance = 2;
        this.bot = bot;
        this.targets = targets;
        // const mcData = mcDataLoader(bot.version);
        // this.movements = new Movements(bot, mcData);
    }
    update() {
        var _a;
        const player = (_a = this.targets.player) === null || _a === void 0 ? void 0 : _a.entity;
        if (player != null) {
            this.bot
                .lookAt(player.position.offset(0, player.height, 0))
                .then(() => {
                if (this.distanceToTarget() > 2) {
                    this.bot.setControlState('forward', true);
                }
                else {
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
    distanceToTarget() {
        var _a;
        const player = (_a = this.targets.player) === null || _a === void 0 ? void 0 : _a.entity;
        if (player == null)
            return 0;
        return this.bot.entity.position.distanceTo(player.position);
    }
}
exports.BehaviorFollowPlayer = BehaviorFollowPlayer;
//# sourceMappingURL=behaviorFollowPlayer.js.map