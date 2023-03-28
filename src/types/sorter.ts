import { ICoordinate } from '.';

interface BotChest {
  position: ICoordinate;
  itemName: string;
}

export interface SorterConfig {
  standByPosition: ICoordinate;
  withdrawalPosition: ICoordinate;
  depositChests: BotChest[];
}

export interface SorterConfigs {
  [username: string]: SorterConfig;
}
