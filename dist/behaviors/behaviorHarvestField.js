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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BehaviorHarvestField = void 0;
const mineflayer_pathfinder_1 = require("mineflayer-pathfinder");
const vec3_1 = require("vec3");
const config_1 = require("../config");
const helpers_1 = require("../helpers");
class BehaviorHarvestField {
    constructor(bot, targets) {
        this.stateName = 'Harvest Field';
        this.active = false;
        this.finished = false;
        this.onStateEntered = () => __awaiter(this, void 0, void 0, function* () {
            this.finished = false;
            const farmableBlocks = this.getFarmableBlocks(this.targets.item.fieldToHarvest);
            yield this.harvestField(farmableBlocks);
            this.finished = true;
        });
        this.getXRange = (boundary) => {
            const [startPosition, endPosition] = boundary;
            const [startX] = startPosition;
            const [endX] = endPosition;
            const smallerX = startX > endX ? endX : startX;
            const biggerX = startX < endX ? endX : startX;
            return [smallerX, biggerX];
        };
        this.getZRange = (boundary) => {
            const [startPosition, endPosition] = boundary;
            const [, , startZ] = startPosition;
            const [, , endZ] = endPosition;
            const smallerZ = startZ > endZ ? endZ : startZ;
            const biggerZ = startZ < endZ ? endZ : startZ;
            return [smallerZ, biggerZ];
        };
        this.getBlocksIn = (boundary) => {
            const [startX, endX] = this.getXRange(boundary);
            const [startZ, endZ] = this.getZRange(boundary);
            let fieldBlocks = [];
            for (let x = startX; x <= endX; x++) {
                for (let z = startZ; z <= endZ; z++) {
                    const block = this.bot.blockAt(new vec3_1.Vec3(x, -60, z));
                    fieldBlocks.push(block);
                }
            }
            return fieldBlocks;
        };
        this.getFarmableBlocks = (field) => {
            console.log(this.targets.item.fieldToHarvest);
            return this.getBlocksIn(field.boundary).filter(({ position }) => {
                var _a;
                const { x, y, z } = position;
                return ((_a = this.bot.blockAt(new vec3_1.Vec3(x, y - 1, z))) === null || _a === void 0 ? void 0 : _a.name) === 'farmland';
            });
        };
        this.isHarvestable = (block) => {
            return this.harvestableCrops.some((crop) => block.name === crop.name && block.metadata === crop.harvestableAge);
        };
        this.harvestField = (blocks) => __awaiter(this, void 0, void 0, function* () {
            for (let block of blocks) {
                // skip blocks that should not be harvested
                if (!this.isHarvestable(block))
                    continue;
                yield this.harvestBlock(block);
                yield (0, helpers_1.asyncTimeout)(300);
                // look for drops within 5 block radius
                const drops = Object.values(this.bot.entities).filter((e) => e.entityType === 45 &&
                    e.position.distanceTo(this.bot.entity.position) < 5);
                for (let drop of drops) {
                    const { x, z } = drop.position;
                    yield this.bot.pathfinder.goto(new mineflayer_pathfinder_1.goals.GoalNearXZ(x, z, 1));
                }
            }
        });
        this.harvestBlock = (block) => __awaiter(this, void 0, void 0, function* () {
            const { x, z } = block.position;
            yield this.bot.pathfinder.goto(new mineflayer_pathfinder_1.goals.GoalNearXZ(x, z, 1));
            yield this.bot.dig(block);
            this.bot.stopDigging();
        });
        this.isFinished = () => this.finished;
        this.bot = bot;
        this.targets = targets;
        this.harvestableCrops = Object.entries(config_1.crops).map(([name, { harvestableAge }]) => ({ name, harvestableAge }));
    }
}
exports.BehaviorHarvestField = BehaviorHarvestField;
//# sourceMappingURL=behaviorHarvestField.js.map