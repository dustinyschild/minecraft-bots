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
exports.BehaviorStoreItems = void 0;
const mineflayer_pathfinder_1 = require("mineflayer-pathfinder");
const vec3_1 = require("vec3");
const config_1 = require("../config");
const helpers_1 = require("../helpers");
class BehaviorStoreItems {
    constructor(bot, targets) {
        this.stateName = 'Store Item';
        this.active = false;
        this.finished = false;
        this.onStateEntered = () => __awaiter(this, void 0, void 0, function* () {
            this.finished = false;
            yield this.store(this.targets.item.fieldToHarvest);
            this.finished = true;
        });
        // reset targeted field
        this.onStateExited = () => {
            this.targets.item.fieldToHarvest = null;
        };
        this.store = (field) => __awaiter(this, void 0, void 0, function* () {
            yield this.bot.pathfinder.goto(new mineflayer_pathfinder_1.goals.GoalNear(...field.yieldChest, 1));
            const yieldChestToOpen = this.bot.blockAt(new vec3_1.Vec3(...field.yieldChest));
            if (yieldChestToOpen) {
                const openChest = yield this.bot.openContainer(yieldChestToOpen);
                yield (0, helpers_1.asyncTimeout)(350);
                // total inventory minus number of seeds needed for replanting
                const totalInventoryCount = this.bot.inventory
                    .items()
                    .filter((item) => item.type === config_1.crops[field.crop].yieldItem)
                    .reduce((total, item) => (total += item.count), 0);
                yield openChest.deposit(config_1.crops[field.crop].yieldItem, null, totalInventoryCount);
                yield (0, helpers_1.asyncTimeout)(350);
                openChest.close();
            }
            const seedsChestToOpen = this.bot.blockAt(new vec3_1.Vec3(...field.seedChest));
            if (seedsChestToOpen) {
                const openChest = yield this.bot.openContainer(seedsChestToOpen);
                const totalInventoryCount = this.bot.inventory
                    .items()
                    .filter((item) => item.type === config_1.crops[field.crop].sowableItem)
                    .reduce((total, item) => (total += item.count), 0);
                yield openChest.deposit(config_1.crops[field.crop].sowableItem, null, totalInventoryCount);
                openChest.close();
            }
            // potatoes only
            const discardItem = config_1.crops[field.crop].discardItem;
            if (discardItem && field.discardChest) {
                const discardChestToOpen = this.bot.blockAt(new vec3_1.Vec3(...field.discardChest));
                if (discardChestToOpen) {
                    const openChest = yield this.bot.openContainer(discardChestToOpen);
                    const totalInventoryCount = this.bot.inventory
                        .items()
                        .filter((item) => item.type === discardItem)
                        .reduce((total, item) => (total += item.count), 0);
                    yield openChest.deposit(discardItem, null, totalInventoryCount);
                    openChest.close();
                }
            }
            else if (config_1.crops[field.crop].discardItem && !field.discardChest) {
                console.log('No discard chest provided');
            }
        });
        this.isFinished = () => this.finished;
        this.bot = bot;
        this.targets = targets;
    }
}
exports.BehaviorStoreItems = BehaviorStoreItems;
//# sourceMappingURL=behaviorStoreItems.js.map