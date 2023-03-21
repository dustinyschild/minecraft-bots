import { Coordinate } from '.';

interface SortChest {
  position: Coordinate;
  itemName: string;
}

export interface SorterConfig {
  standByPosition: Coordinate;
  withdrawalPosition: Coordinate;
  depositChests: SortChest[];
}

export interface SorterConfigs {
  [username: string]: SorterConfig;
}
