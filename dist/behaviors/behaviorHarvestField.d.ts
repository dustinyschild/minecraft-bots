import { Bot } from 'mineflayer';
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine';
import { Block } from 'prismarine-block';
import { Boundary } from '../types';
import { Field } from '../types/farmer';
export declare class BehaviorHarvestField implements StateBehavior {
    stateName: string;
    active: boolean;
    bot: Bot;
    targets: StateMachineTargets;
    finished: boolean;
    harvestableCrops: {
        name: string;
        harvestableAge: number;
    }[];
    constructor(bot: Bot, targets: StateMachineTargets);
    onStateEntered: () => Promise<void>;
    getXRange: (boundary: Boundary) => number[];
    getZRange: (boundary: Boundary) => number[];
    getBlocksIn: (boundary: Boundary) => Block[];
    getFarmableBlocks: (field: Field) => Block[];
    isHarvestable: (block: Block) => boolean;
    harvestField: (blocks: Block[]) => Promise<void>;
    harvestBlock: (block: Block) => Promise<void>;
    isFinished: () => boolean;
}
