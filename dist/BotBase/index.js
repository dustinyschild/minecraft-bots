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
exports.BotBase = void 0;
const mineflayer_1 = require("mineflayer");
const minecraft_data_1 = __importDefault(require("minecraft-data"));
const mineflayer_pathfinder_1 = require("mineflayer-pathfinder");
const vec3_1 = require("vec3");
const chat_1 = require("../modules/chat");
class BotBase {
    constructor(options) {
        /** Methods */
        this.sleep = () => __awaiter(this, void 0, void 0, function* () {
            this.bot.chat('going to sleep now');
            yield this.bot.pathfinder.goto(new mineflayer_pathfinder_1.goals.GoalNear(2, -60, -15, 1));
            const bedBlock = this.bot.blockAt(new vec3_1.Vec3(2, -60, -15));
            if (bedBlock && this.bot.isABed(bedBlock)) {
                yield this.bot.sleep(bedBlock).catch(() => {
                    console.log("Can't sleep now");
                });
            }
        });
        this.bot = (0, mineflayer_1.createBot)(options);
        this.mcData = (0, minecraft_data_1.default)(this.bot.version);
        this.bot.loadPlugin(mineflayer_pathfinder_1.pathfinder);
        this.movements = new mineflayer_pathfinder_1.Movements(this.bot, this.mcData);
        this.bot.once('spawn', () => __awaiter(this, void 0, void 0, function* () {
            console.log(`${this.bot.username} joined ${options.host}`);
            (0, chat_1.registerCommands)(this.bot, {
                say: (_username, commandArgs) => {
                    this.bot.chat(commandArgs.join(' '));
                },
                block: (_username, [blockName]) => {
                    console.log(this.bot.registry.blocksByName[blockName]);
                },
                blocksLike: (_username, [searchText]) => {
                    Object.keys(this.bot.registry.blocksByName)
                        .filter((key) => key.includes(searchText))
                        .map((match) => console.log(match));
                },
                blockAt: (_username, [x, y, z]) => {
                    console.log(this.bot.blockAt(new vec3_1.Vec3(parseInt(x), parseInt(y), parseInt(z))));
                },
                item: (_username, [itemName]) => {
                    console.log(this.bot.registry.itemsByName[itemName]);
                },
                itemsLike: (_username, [searchText]) => {
                    Object.keys(this.bot.registry.itemsByName)
                        .filter((key) => key.includes(searchText))
                        .map((match) => console.log(match));
                },
                itemById: (_username, [id]) => {
                    const item = Object.values(this.bot.registry.itemsByName).find((item) => item.id === parseInt(id));
                    console.log(item);
                },
                getDrops: () => {
                    Object.values(this.bot.entities)
                        .filter((e) => e.entityType === 45)
                        .forEach((e) => {
                        var _a;
                        const entityItem = e.metadata[8];
                        const itemName = (_a = Object.values(this.bot.registry.itemsByName).find((item) => item.id === entityItem.itemId)) === null || _a === void 0 ? void 0 : _a.name;
                        console.log(e.position.distanceTo(this.bot.entity.position), this.bot.registry.itemsByName[itemName]);
                    });
                },
                entity: (_username, [id]) => {
                    console.log(this.bot.entities[id]);
                },
                self: (_username, [property]) => {
                    if (property) {
                        const [, prop] = Object.entries(this.bot.entity).find(([prop]) => prop === property);
                        console.log(prop);
                    }
                    else {
                        console.log(this.bot.entity);
                    }
                },
                sleep: this.sleep,
            });
        }));
    }
}
exports.BotBase = BotBase;
//# sourceMappingURL=index.js.map