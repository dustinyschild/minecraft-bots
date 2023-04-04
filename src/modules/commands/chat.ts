import { Bot } from 'mineflayer';
import { BotCommandDictionary } from '../../types';

export const loadChatCommands = (bot: Bot): BotCommandDictionary => {
  return {
    say: (_username, commandArgs) => {
      bot.chat(commandArgs.join(' '));
    },
    whisper: (_username, [recipient, ...words]) => {
      const message = words.join(' ');

      bot.whisper(recipient, message);
    },
  };
};
