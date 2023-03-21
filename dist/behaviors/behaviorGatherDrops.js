"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BehaviorGatherDrops = void 0;
class BehaviorGatherDrops {
    constructor(bot, field) {
        this.stateName = 'Gather Drops';
        this.active = false;
        this.drops = [];
        this.startingGoalReached = false;
        this.endingGoalReached = false;
        this.onStateEntered = () => {
            // move to start location
            this.startingGoalReached = true;
        };
        this.update = () => {
            this.bot.entities;
        };
        this.locateDrops = () => Object.entries(this.bot.entities)
            .filter(([_id, e]) => e.entityType === 45)
            .map(([id, { position }]) => ({ id, position }));
        this.resumeWalkingArea = () => {
            // set goal to end position
        };
        this.bot = bot;
        this.field = field;
        this.startGoal = field.boundary[0];
        this.endGoal = field.boundary[1];
    }
}
exports.BehaviorGatherDrops = BehaviorGatherDrops;
//# sourceMappingURL=behaviorGatherDrops.js.map