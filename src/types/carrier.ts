import { ICoordinate, BotChest, IBot } from '.';

export interface ICarrier extends IBot {
  standByPosition: ICoordinate;
  withdrawalChests: BotChest[];
  depositChests: BotChest[];
}

export interface CarrierConfigs {
  [username: string]: ICarrier;
}
