import { BotOptions } from 'mineflayer';
import { BotBase } from '../BotBase';
import { Coordinate } from '../types';
export declare class BotCarrier extends BotBase {
    standByPosition: Coordinate;
    withdrawalChests: Coordinate[];
    depositChest: Coordinate;
    constructor(options: BotOptions);
    checkWithdrawalChests: () => void;
}
