import { Bot } from 'mineflayer';
import { BotCommandDictionary } from '../../types';
import { EntityFilters } from 'mineflayer-statemachine';
import { goals, pathfinder } from 'mineflayer-pathfinder';

export const loadMovementCommands = (bot: Bot): BotCommandDictionary => {
  if (!bot.hasPlugin(pathfinder)) {
    console.warn('Movement commands disabled: pathfinder plugin not loaded.');

    return {};
  }

  return {
    come: (username) => {
      const player = Object.values(bot.entities).find((entity) => {
        return (
          EntityFilters().PlayersOnly(entity) && entity.username === username
        );
      });

      if (player) {
        const { x, y, z } = player.position;
        bot.pathfinder.goto(new goals.GoalNear(x, y, z, 1));
      } else {
        bot.whisper(username, 'Out of range.');
      }
    },
    follow: (username, _commandArgs) => {
      bot.whisper(username, '`follow` not implemented');
    },
    stay: (username, _commandArgs) => {
      bot.whisper(username, '`stay` not implemented');
    },
    goto: (username, _commandArgs) => {
      bot.whisper(username, '`goto` not implemented');
    },
  };
};
