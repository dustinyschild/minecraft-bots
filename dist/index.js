"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BotCarrier_1 = require("./BotCarrier");
const targetServer = {
    host: 'localhost',
    port: 25565,
    version: '1.19.3',
};
// new BotBase({ ...targetServer, username: 'based_bot' });
// new BotFarmer({ ...targetServer, username: 'farmer' });
// new BotSorter({ ...targetServer, username: 'sorter' });
new BotCarrier_1.BotCarrier(Object.assign(Object.assign({}, targetServer), { username: 'randy' }));
//# sourceMappingURL=index.js.map