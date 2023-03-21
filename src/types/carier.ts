import { Coordinate } from '.';

export interface CarrierConfig {
  standByPosition: Coordinate;
  withdrawalChests: Coordinate[];
  depositChest: Coordinate;
}

export interface CarrierConfigs {
  [username: string]: CarrierConfig;
}
