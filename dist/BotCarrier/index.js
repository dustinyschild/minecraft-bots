"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotCarrier = void 0;
const vec3_1 = require("vec3");
const BotBase_1 = require("../BotBase");
const configs_1 = require("../configs");
/* for bulk item transport */
class BotCarrier extends BotBase_1.BotBase {
    constructor(options) {
        super(options);
        this.checkWithdrawalChests = () => {
            this.withdrawalChests.forEach((position) => {
                const chest = this.bot.blockAt(new vec3_1.Vec3(...position));
                console.log(chest);
            });
        };
        const config = (0, configs_1.loadCarrierConfig)(options.username);
        this.standByPosition = config.standByPosition;
        this.withdrawalChests = config.withdrawalChests;
        this.depositChest = config.depositChest;
        this.bot.on('spawn', () => {
            this.bot.on('chat', (username, message) => {
                if (message === 'check') {
                    this.checkWithdrawalChests();
                }
            });
        });
    }
}
exports.BotCarrier = BotCarrier;
//# sourceMappingURL=index.js.map