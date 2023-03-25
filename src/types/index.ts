export type Coordinate = [number, number, number];

export const enum BotType {
  FARMER = 'farmer',
  SORTER = 'sorter',
}

export type Boundary = [Coordinate, Coordinate];

// helper type since this.bot.registry.itemsByName doesn't have type support
export interface ItemRegistry {
  [key: string]: {
    id: number;
    name: string;
    displayName: string;
    stackSize: number;
  };
}

export interface WithdrawalChest {
  position: Coordinate;
  items?: string[];
}

export interface DepositChest {
  position: Coordinate;
  items: string[];
}

export type BotChest = WithdrawalChest | DepositChest;
