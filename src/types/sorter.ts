import { Coordinate } from '.';

interface BotChest {
  position: Coordinate;
  itemName: string;
}

export interface SorterConfig {
  standByPosition: Coordinate;
  withdrawalPosition: Coordinate;
  depositChests: BotChest[];
}

export interface SorterConfigs {
  [username: string]: SorterConfig;
}
