export type Coordinate = [number, number, number];
export declare const enum BotType {
    FARMER = "farmer",
    SORTER = "sorter"
}
export type Boundary = [Coordinate, Coordinate];
export interface ItemRegistry {
    [key: string]: {
        id: number;
        name: string;
        displayName: string;
        stackSize: number;
    };
}
