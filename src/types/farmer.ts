import { Boundary, ICoordinate, BotChest } from '.';

export interface Farm {
  boundary: Boundary;
  crop: string;
}

export interface Field {
  boundary: [ICoordinate, ICoordinate];
  block: string;
  crop: string;
  seed: string;
  maturity: number;
  depositChests: BotChest[];
}

export interface FarmerConfig {
  standByPosition: ICoordinate;
  fields: Field[];
}

export interface FarmerConfigs {
  [username: string]: FarmerConfig;
}
