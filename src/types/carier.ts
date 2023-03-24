import { Coordinate, DepositChest } from '.';

export interface CarrierConfig {
  standByPosition: Coordinate;
  withdrawalChests: DepositChest[];
  depositChests: DepositChest[];
}

export interface CarrierConfigs {
  [username: string]: CarrierConfig;
}
