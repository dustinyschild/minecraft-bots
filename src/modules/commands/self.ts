import { Bot } from 'mineflayer';
import { Entity } from 'prismarine-entity';
import { BotCommandDictionary } from '../../types';

export const loadSelfCommands = (bot: Bot): BotCommandDictionary => {
  return {
    self: (_username, [property]) => {
      if (property) {
        const [_key, propValue] = Object.entries(bot.entity).find(
          ([key]) => key === property,
        ) as [string, Entity];

        console.log(propValue);
      } else {
        console.log(bot.entity);
      }
    },
    inventory: (_username, [itemName]) => {
      const inventory = bot.inventory
        .items()
        .map(({ type, name, count }) => ({ type, name, count }));

      if (itemName) {
        const filteredItems = inventory.filter(
          (item) => item.name === itemName,
        );

        console.log(filteredItems);
      } else {
        console.log(inventory);
      }
    },
  };
};
