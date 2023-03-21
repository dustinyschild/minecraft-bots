import { Bot, BotOptions } from 'mineflayer';
import { IndexedData } from 'minecraft-data';
import { Movements } from 'mineflayer-pathfinder';
export declare class BotBase {
    bot: Bot;
    mcData: IndexedData;
    movements: Movements;
    constructor(options: BotOptions);
    /** Methods */
    sleep: () => Promise<void>;
}
