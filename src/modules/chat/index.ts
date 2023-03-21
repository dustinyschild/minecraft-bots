import { Bot } from 'mineflayer';

interface BotCommand {
  caller: string;
  command: string;
  commandArgs: string[];
}

interface BotCommandListeners {
  [name: string]: (username: string, commandArgs: string[]) => void;
}

export type BotCommandCallback = (
  username: string,
  commandArgs: string[],
) => void;

export const parseCommand = (username: string, message: string): BotCommand => {
  const [command, ...commandArgs] = message.split(' ');

  return {
    caller: username,
    command,
    commandArgs,
  };
};

export const registerCommands = (bot: Bot, commands: BotCommandListeners) => {
  bot.on('whisper', (username, message) => {
    const { command, commandArgs } = parseCommand(username, message);

    commands[command]?.(username, commandArgs);
  });
};
