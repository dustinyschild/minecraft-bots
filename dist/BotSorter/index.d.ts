import { Bot, BotOptions } from 'mineflayer';
import { IndexedData } from 'minecraft-data';
import { Coordinate } from '../types';
export declare class BotSorter {
    bot: Bot;
    mcData: IndexedData;
    standByPosition: Coordinate;
    withdrawalPosition: Coordinate;
    depositChests: {
        position: [number, number, number];
        itemName: string;
    }[];
    withdrawalChestOpen: boolean;
    isSorting: boolean;
    shouldCheckChest: boolean;
    constructor(options: BotOptions);
    sort: () => Promise<void>;
    withdrawal: () => Promise<void>;
    deposit: (depositPosition: [number, number, number], itemName: string) => Promise<void>;
}
