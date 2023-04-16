import cache from '.';
import { Item } from 'prismarine-item';
import { BotChest, ICoordinate } from '../../types';

type ChestType = 'sort' | 'dump' | 'yield' | 'mail';

interface CacheChest extends BotChest {
  name: string;
  type: ChestType;
  contents: Item[];
}

export const add = async (
  name: string,
  type: ChestType,
  position: ICoordinate,
  include?: string[],
) => {
  const chests = await cache.get('chests').then((data) => {
    if (data) {
      return JSON.parse(data) as CacheChest[];
    }

    return [];
  });

  if (chests.some((chest) => chest.name === name)) {
    return console.warn('Chest name already exists');
  } else if (
    chests.some((chest) => chest.position.toString() === position.toString())
  ) {
    return console.warn('Chest already exists at this position');
  }

  chests.push({ name, type, contents: [], position, items: include });
  await cache.set('chests', JSON.stringify(chests));
};

export const findOne = async (chestName: string) => {
  return cache.get('chests').then((data) => {
    if (data) {
      const chests = JSON.parse(data) as CacheChest[];

      return chests.find((chest) => chest.name === chestName);
    }

    return null;
  });
};

export const update = async (
  chestName: string,
  updated: Partial<CacheChest>,
) => {
  const chests = await cache.get('chests').then((data) => {
    if (data) {
      return JSON.parse(data) as CacheChest[];
    }

    return [];
  });

  const updatedChests = chests.map((chest) => {
    if (chest.name === chestName) {
      return {
        ...chest,
        ...updated,
      };
    }

    return chest;
  });

  await cache.set('chests', JSON.stringify(updatedChests));
};

export const remove = (chestName: string) => {};
