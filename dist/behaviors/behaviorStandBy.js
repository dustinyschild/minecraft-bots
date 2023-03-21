"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BehaviorStandBy = void 0;
const mineflayer_pathfinder_1 = require("mineflayer-pathfinder");
const minecraft_data_1 = __importDefault(require("minecraft-data"));
class BehaviorStandBy {
    constructor(bot, position) {
        this.stateName = 'Stand By';
        this.active = false;
        this.onStateEntered = () => {
            const { x, y, z } = this.position;
            this.finished = false;
            this.bot.pathfinder
                .goto(new mineflayer_pathfinder_1.goals.GoalBlock(x, y, z))
                .then(() => __awaiter(this, void 0, void 0, function* () {
                return this.bot.look(270 * (Math.PI / 180), 0);
            }))
                .catch((err) => {
                console.error(err);
            })
                .finally(() => {
                this.finished = true;
            });
        };
        this.isFinished = () => this.finished;
        this.bot = bot;
        const mcData = (0, minecraft_data_1.default)(bot.version);
        this.movements = new mineflayer_pathfinder_1.Movements(bot, mcData);
        this.position = position;
        this.finished = false;
    }
}
exports.BehaviorStandBy = BehaviorStandBy;
//# sourceMappingURL=behaviorStandBy.js.map