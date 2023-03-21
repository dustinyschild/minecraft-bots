"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BehaviorWait = void 0;
class BehaviorWait {
    constructor(delay) {
        this.stateName = 'Wait';
        this.active = false;
        this.finished = false;
        this.onStateEntered = () => {
            this.finished = false;
            setTimeout(() => {
                this.finished = true;
            }, this.delay);
        };
        this.isFinished = () => this.finished;
        this.delay = delay;
    }
}
exports.BehaviorWait = BehaviorWait;
//# sourceMappingURL=behaviorWait.js.map