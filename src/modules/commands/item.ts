import { Bot } from 'mineflayer';
import { BotCommandDictionary, ItemRegistry } from '../../types';

export const loadItemCommands = (bot: Bot): BotCommandDictionary => {
  return {
    item: (_username, [itemName]) => {
      console.log(bot.registry.itemsByName[itemName]);
    },
    itemsLike: (_username, [searchText]) => {
      Object.keys(bot.registry.itemsByName)
        .filter((key) => key.includes(searchText))
        .map((match) => console.log(match));
    },
    itemById: (_username, [id]) => {
      const item = Object.values(bot.registry.itemsByName as ItemRegistry).find(
        (item: any) => item.id === parseInt(id),
      );

      console.log(item);
    },
  };
};
