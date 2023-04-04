import { Bot } from 'mineflayer';
import { BotCommandDictionary, ItemRegistry } from '../../types';
import { Entity } from 'prismarine-entity';

export const loadEntityCommands = (bot: Bot): BotCommandDictionary => {
  return {
    drops: () => {
      Object.values(bot.entities)
        .filter((e) => e.entityType === 45)
        .forEach((e) => {
          const entityItem = e.metadata[8] as any;

          const itemName = Object.values(
            bot.registry.itemsByName as ItemRegistry,
          ).find((item: any) => item.id === entityItem.itemId)?.name;

          console.log(
            e.position.distanceTo(bot.entity.position),
            bot.registry.itemsByName[itemName],
          );
        });
    },
    entity: (_username, [id]) => {
      console.log(bot.entities[id]);
    },
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
  };
};
