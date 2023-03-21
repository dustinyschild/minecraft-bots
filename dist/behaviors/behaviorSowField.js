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
exports.BehaviorSowField = void 0;
const mineflayer_pathfinder_1 = require("mineflayer-pathfinder");
const vec3_1 = require("vec3");
const config_1 = require("../config");
const helpers_1 = require("../helpers");
class BehaviorSowField {
    constructor(bot, targets) {
        this.stateName = 'Sow Field';
        this.active = false;
        this.finished = false;
        this.onStateEntered = () => __awaiter(this, void 0, void 0, function* () {
            this.finished = false;
            const field = this.targets.item.fieldToHarvest;
            // filter empty blocks
            const fieldBlocks = this.getBlocksIn(field.boundary).filter((block) => block.name === 'air');
            yield this.plantField(fieldBlocks, field.crop);
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
        this.plantField = (sowableBlocks, cropType) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            let noSeeds = false;
            yield this.bot.equip(config_1.crops[cropType].sowableItem, 'hand').catch(() => {
                this.bot.chat(`I don't have seeds for ${cropType}`);
                noSeeds = true;
            });
            for (let block of sowableBlocks) {
                if (noSeeds)
                    return;
                yield (0, helpers_1.asyncTimeout)(100);
                if (((_a = this.bot.heldItem) === null || _a === void 0 ? void 0 : _a.type) !== config_1.crops[cropType].sowableItem) {
                    yield this.bot.equip(config_1.crops[cropType].sowableItem, 'hand').catch(() => {
                        console.log('No more seeds');
                        noSeeds = true;
                    });
                }
                yield this.plant(block);
            }
        });
        this.plant = (block) => __awaiter(this, void 0, void 0, function* () {
            const { x, y, z } = block.position;
            const blockToSow = this.bot.blockAt(new vec3_1.Vec3(x, y - 1, z));
            if ((blockToSow === null || blockToSow === void 0 ? void 0 : blockToSow.name) === 'farmland') {
                yield this.bot.pathfinder.goto(new mineflayer_pathfinder_1.goals.GoalNearXZ(blockToSow.position.x, blockToSow.position.z, 1));
                yield this.bot
                    .placeBlock(blockToSow, new vec3_1.Vec3(0, 1, 0))
                    .catch((err) => console.error(err));
            }
        });
        this.isFinished = () => this.finished;
        this.bot = bot;
        this.targets = targets;
    }
}
exports.BehaviorSowField = BehaviorSowField;
//# sourceMappingURL=behaviorSowField.js.map