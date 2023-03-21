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
exports.BotSorter = void 0;
const mineflayer_1 = require("mineflayer");
const minecraft_data_1 = __importDefault(require("minecraft-data"));
const mineflayer_pathfinder_1 = require("mineflayer-pathfinder");
const vec3_1 = require("vec3");
const chat_1 = require("../modules/chat");
const promises_1 = require("fs/promises");
const configs_1 = require("../configs");
class BotSorter {
    constructor(options) {
        this.withdrawalChestOpen = false;
        this.isSorting = false;
        this.shouldCheckChest = false;
        this.sort = () => __awaiter(this, void 0, void 0, function* () {
            this.isSorting = true;
            yield this.bot.pathfinder.goto(new mineflayer_pathfinder_1.goals.GoalNear(...this.withdrawalPosition, 1));
            yield this.withdrawal();
            for (let chest of this.depositChests) {
                const hasItem = this.bot.inventory.items().some((item) => {
                    return item.name === chest.itemName;
                });
                if (hasItem) {
                    yield this.bot.pathfinder.goto(new mineflayer_pathfinder_1.goals.GoalNear(...chest.position, 3));
                    yield this.deposit(chest.position, chest.itemName);
                }
            }
            yield this.bot.pathfinder.goto(new mineflayer_pathfinder_1.goals.GoalBlock(...this.standByPosition));
            this.isSorting = false;
        });
        this.withdrawal = () => __awaiter(this, void 0, void 0, function* () {
            const chestToOpen = this.bot.blockAt(new vec3_1.Vec3(...this.withdrawalPosition));
            if (chestToOpen) {
                this.withdrawalChestOpen = true;
                const withdrawalChest = yield this.bot.openContainer(chestToOpen);
                const chestItems = withdrawalChest.containerItems();
                for (let item of chestItems) {
                    yield withdrawalChest.withdraw(item.type, null, item.count);
                }
                withdrawalChest.close();
                this.withdrawalChestOpen = false;
            }
        });
        this.deposit = (depositPosition, itemName) => __awaiter(this, void 0, void 0, function* () {
            const chestToOpen = this.bot.blockAt(new vec3_1.Vec3(...depositPosition));
            if (chestToOpen) {
                const depositChest = yield this.bot
                    .openContainer(chestToOpen)
                    .catch(() => {
                    this.bot.chat(`There is no chest at ${depositPosition}`);
                });
                const inventoryItems = this.bot.inventory.items().filter((item) => {
                    return item.name === itemName;
                });
                console.log(inventoryItems);
                if (depositChest) {
                    for (let item of inventoryItems) {
                        yield depositChest.deposit(item.type, null, item.count);
                    }
                    depositChest.close();
                }
            }
        });
        this.bot = (0, mineflayer_1.createBot)(options);
        this.mcData = (0, minecraft_data_1.default)(this.bot.version);
        this.bot.loadPlugin(mineflayer_pathfinder_1.pathfinder);
        const defaultMove = new mineflayer_pathfinder_1.Movements(this.bot, this.mcData);
        this.bot.pathfinder.setMovements(defaultMove);
        // will error if config can't be found.
        const config = (0, configs_1.loadSorterConfig)(options.username);
        this.standByPosition = config.standByPosition;
        this.withdrawalPosition = config.withdrawalPosition;
        this.depositChests = config.depositChests;
        this.bot.once('spawn', () => __awaiter(this, void 0, void 0, function* () {
            (0, chat_1.registerCommands)(this.bot, {
                sort: this.sort,
                addDeposit: ([itemName, ...coords]) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const [x, y, z] = coords.map(parseInt);
                    if (((_a = this.bot.blockAt(new vec3_1.Vec3(x, y, z))) === null || _a === void 0 ? void 0 : _a.name) === 'air') {
                        this.depositChests.push({
                            position: [x, y, z],
                            itemName,
                        });
                    }
                    else {
                        this.bot.chat(`Cannot register chest: [${x}, ${y}, ${z}] is occupied.`);
                    }
                    // rewrite file with new config values
                    yield (0, promises_1.writeFile)('./src/configs/sorter.json', JSON.stringify({
                        withdrawalPosition: this.withdrawalPosition,
                        depositChests: this.depositChests,
                    }));
                    this.bot.chat(`New deposit chest for item '${itemName}' at [${x}, ${y}, ${z}]`);
                }),
            });
            this.bot.on('chestLidMove', (block, isOpen) => {
                const { x, y, z } = block.position;
                const [withdrawalX, withdrawalY, withdrawZ] = this.withdrawalPosition;
                if (x === withdrawalX &&
                    y === withdrawalY &&
                    z === withdrawZ &&
                    isOpen === 0 &&
                    !this.withdrawalChestOpen) {
                    if (this.isSorting) {
                        this.shouldCheckChest = true;
                    }
                    else {
                        this.sort();
                    }
                }
            });
            this.bot.on('chat', (username, message) => __awaiter(this, void 0, void 0, function* () {
                if (message === 'sort') {
                    yield this.sort();
                }
            }));
        }));
    }
}
exports.BotSorter = BotSorter;
//# sourceMappingURL=index.js.map