import { Boundary, Coordinate, DepositChest } from '.';

export interface Farm {
  boundary: Boundary;
  crop: string;
}

export interface Field {
  boundary: [Coordinate, Coordinate];
  block: string;
  crop: string;
  seed: string;
  maturity: number;
  depositChests: DepositChest[];
}

export interface FarmerConfig {
  standByPosition: Coordinate;
  fields: Field[];
}

export interface FarmerConfigs {
  [username: string]: FarmerConfig;
}
