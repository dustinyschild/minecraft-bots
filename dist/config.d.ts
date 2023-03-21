export interface FarmItem {
    harvestableBlock: number;
    harvestableAge: number;
    sowableItem: number;
    yieldItem: number;
    discardItem?: number;
}
export interface FarmItems {
    [key: string]: FarmItem;
}
export declare const crops: FarmItems;
