import { Bot } from 'mineflayer';
interface BotCommand {
    caller: string;
    command: string;
    commandArgs: string[];
}
interface BotCommandListeners {
    [name: string]: (commandArgs: string[]) => void;
}
export declare const parseCommand: (username: string, message: string) => BotCommand;
export declare const registerCommands: (bot: Bot, commands: BotCommandListeners) => void;
export {};
