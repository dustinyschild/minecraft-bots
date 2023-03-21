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

export const crops: FarmItems = {
  wheat: {
    harvestableBlock: 173,
    harvestableAge: 7,
    sowableItem: 788,
    yieldItem: 789,
  },
  carrots: {
    harvestableBlock: 365,
    harvestableAge: 7,
    sowableItem: 1023,
    yieldItem: 1023,
  },
  beetroots: {
    harvestableBlock: 574,
    harvestableAge: 3,
    sowableItem: 1079,
    yieldItem: 1078,
  },
  potatoes: {
    harvestableBlock: 366,
    harvestableAge: 7,
    sowableItem: 1024,
    yieldItem: 1024,
    discardItem: 1026,
  },
};
