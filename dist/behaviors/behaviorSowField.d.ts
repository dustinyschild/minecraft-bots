import { Bot } from 'mineflayer';
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine';
import { Block } from 'prismarine-block';
import { Boundary } from '../types';
import { CropType } from '../types/farmer';
export declare class BehaviorSowField implements StateBehavior {
    stateName: string;
    active: boolean;
    bot: Bot;
    targets: StateMachineTargets;
    finished: boolean;
    constructor(bot: Bot, targets: StateMachineTargets);
    onStateEntered: () => Promise<void>;
    getXRange: (boundary: Boundary) => number[];
    getZRange: (boundary: Boundary) => number[];
    getBlocksIn: (boundary: Boundary) => Block[];
    plantField: (sowableBlocks: Block[], cropType: CropType) => Promise<void>;
    plant: (block: Block) => Promise<void>;
    isFinished: () => boolean;
}
