import { Boundary, Coordinate } from '.';
export declare const enum CropType {
    WHEAT = "wheat",
    CARROTS = "carrots",
    BEETROOTS = "beetroots",
    POTATOES = "potatoes"
}
export interface Farm {
    boundary: Boundary;
    crop: CropType;
    yieldChest: Coordinate;
    seedChest: Coordinate;
    discardChest?: Coordinate;
}
export interface Field {
    boundary: [Coordinate, Coordinate];
    crop: CropType;
    yieldChest: Coordinate;
    seedChest: Coordinate;
    discardChest?: Coordinate;
}
export interface FarmerConfig {
    fields: Field[];
}
export interface FarmerConfigs {
    [username: string]: FarmerConfig;
}
