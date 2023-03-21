"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BehaviorCheckFields = void 0;
const vec3_1 = require("vec3");
const config_1 = require("../config");
class BehaviorCheckFields {
    constructor(bot, targets, fields) {
        this.stateName = 'Check Fields';
        this.active = false;
        this.onStateEntered = () => {
            // find farm with most harvestableBlocks
            let fieldToHarvest = null;
            let highestYield = 0;
            // get the field with the highest yieldRatio that exceeds threshold value
            for (let field of this.fields) {
                const yieldRatio = this.getYieldableRatio(field);
                if (yieldRatio >= this.harvestThreshold && yieldRatio > highestYield) {
                    highestYield = yieldRatio;
                    fieldToHarvest = field;
                }
            }
            this.targets.item.fieldToHarvest = fieldToHarvest;
        };
        this.getYieldableRatio = (field) => {
            const fieldBlocks = this.getFarmableBlocks(field);
            const harvestableCrops = this.readyToHarvest(fieldBlocks);
            return harvestableCrops.length / fieldBlocks.length;
        };
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
            console.log({ startX, endX, startZ, endZ });
            let fieldBlocks = [];
            for (let x = startX; x <= endX; x++) {
                for (let z = startZ; z <= endZ; z++) {
                    console.log({ x, z });
                    const block = this.bot.blockAt(new vec3_1.Vec3(x, -60, z));
                    console.log(block === null || block === void 0 ? void 0 : block.position);
                    fieldBlocks.push(block);
                }
            }
            return fieldBlocks;
        };
        this.getFarmableBlocks = (field) => this.getBlocksIn(field.boundary).filter(({ position }) => {
            var _a;
            const { x, y, z } = position;
            return ((_a = this.bot.blockAt(new vec3_1.Vec3(x, y - 1, z))) === null || _a === void 0 ? void 0 : _a.name) === 'farmland';
        });
        this.readyToHarvest = (cropBlocks) => {
            return cropBlocks.filter((crop) => { var _a; return crop.metadata === ((_a = config_1.crops[crop.name]) === null || _a === void 0 ? void 0 : _a.harvestableAge); });
        };
        this.shouldHarvest = () => !!this.targets.item.fieldToHarvest;
        this.bot = bot;
        this.targets = targets;
        this.fields = fields;
        this.harvestThreshold = 0.5;
    }
}
exports.BehaviorCheckFields = BehaviorCheckFields;
//# sourceMappingURL=behaviorCheckField.js.map