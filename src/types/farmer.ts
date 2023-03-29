import { IBoundary, ICoordinate, BotChest, IBot } from '.';

export interface IField {
  boundary: IBoundary;
  block: string;
  crop: string;
  seed: string;
  maturity: number;
  depositChests: BotChest[];
}

export interface IFarmer extends IBot {
  standByPosition: ICoordinate;
  fields: IField[];
}

export interface FarmerConfigs {
  [username: string]: IFarmer;
}
