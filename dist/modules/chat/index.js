"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommands = exports.parseCommand = void 0;
const parseCommand = (username, message) => {
    const [command, ...commandArgs] = message.split(' ');
    return {
        caller: username,
        command,
        commandArgs,
    };
};
exports.parseCommand = parseCommand;
const registerCommands = (bot, commands) => {
    bot.on('whisper', (username, message) => {
        var _a;
        const { command, commandArgs } = (0, exports.parseCommand)(username, message);
        (_a = commands[command]) === null || _a === void 0 ? void 0 : _a.call(commands, username, commandArgs);
    });
};
exports.registerCommands = registerCommands;
//# sourceMappingURL=index.js.map