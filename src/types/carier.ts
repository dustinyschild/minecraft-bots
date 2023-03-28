import { ICoordinate, BotChest } from '.';

export interface CarrierConfig {
  standByPosition: ICoordinate;
  withdrawalChests: BotChest[];
  depositChests: BotChest[];
}

export interface CarrierConfigs {
  [username: string]: CarrierConfig;
}
