"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mineflayer_1 = __importDefault(require("mineflayer"));
// const tester1 = createBot({
//   host: 'localhost',
//   port: 25565,
//   username: 'tester1',
//   version: '1.19.3',
// });
// const tester2 = createBot({
//   host: 'localhost',
//   port: 25565,
//   username: 'tester2',
//   version: '1.19.3',
// });
const server = { host: 'localhost', port: 25565, version: '1.19.3' };
const botNames = ['tester1', 'tester2'];
function createBot(username) {
    console.log('create bot', username);
    const bot = mineflayer_1.default.createBot(Object.assign(Object.assign({}, server), { username: botNames[i] }));
    bot.on('error', (err) => {
        console.log(err);
    });
    bot.on('kicked', (reason) => {
        console.log(reason);
    });
}
let i = 0;
function next() {
    if (i < botNames.length) {
        setTimeout(() => {
            createBot(botNames[i]);
            i++;
            next();
        }, 10);
    }
    else {
        console.log('bots loaded');
    }
}
next();
//# sourceMappingURL=testMultiple.js.map