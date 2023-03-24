import { Boundary, Coordinate, DepositChest } from '.';

export const enum CropName {
  WHEAT = 'wheat',
  CARROTS = 'carrots',
  BEETROOTS = 'beetroots',
  POTATOES = 'potatoes',
}

export const enum SeedName {
  WHEAT = 'wheat_seeds',
  CARROTS = 'carrots',
  BEETROOTS = 'beetroot_seeds',
  POTATOES = 'potatoes',
}

export interface Farm {
  boundary: Boundary;
  crop: CropName;
}

export interface Field {
  boundary: [Coordinate, Coordinate];
  crop: CropName;
  seed: SeedName;
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
