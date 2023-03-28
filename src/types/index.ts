export interface IServer {
  host: string;
  port: number;
  version: string;
}

export type ICoordinate = [number, number, number];

export type Boundary = [ICoordinate, ICoordinate];

// helper type since this.bot.registry.itemsByName doesn't have type support
export interface ItemRegistry {
  [key: string]: {
    id: number;
    name: string;
    displayName: string;
    stackSize: number;
  };
}

export interface BotChest {
  position: ICoordinate;
  items?: string[];
}
