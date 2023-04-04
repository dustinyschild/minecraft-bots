import { Bot } from 'mineflayer';
import { BotCommandDictionary } from '../../types';
import { Vec3 } from 'vec3';

export const loadBlockCommands = (bot: Bot): BotCommandDictionary => {
  return {
    block: (_username, [blockName]) => {
      console.log(bot.registry.blocksByName[blockName]);
    },
    blocksLike: (_username, [searchText]) => {
      Object.keys(bot.registry.blocksByName)
        .filter((key) => key.includes(searchText))
        .map((match) => console.log(match));
    },
    blockAt: (_username, [x, y, z]) => {
      console.log(bot.blockAt(new Vec3(parseInt(x), parseInt(y), parseInt(z))));
    },
  };
};
