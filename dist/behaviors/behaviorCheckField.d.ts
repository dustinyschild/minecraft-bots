import { Bot } from 'mineflayer';
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine';
import { Block } from 'prismarine-block';
import { Boundary } from '../types';
import { Field } from '../types/farmer';
export declare class BehaviorCheckFields implements StateBehavior {
    stateName: string;
    active: boolean;
    targets: StateMachineTargets;
    fields: Field[];
    bot: Bot;
    interval?: ReturnType<typeof setInterval>;
    harvestThreshold: number;
    constructor(bot: Bot, targets: StateMachineTargets, fields: Field[]);
    onStateEntered: () => void;
    getYieldableRatio: (field: Field) => number;
    getXRange: (boundary: Boundary) => number[];
    getZRange: (boundary: Boundary) => number[];
    getBlocksIn: (boundary: Boundary) => Block[];
    getFarmableBlocks: (field: Field) => Block[];
    readyToHarvest: (cropBlocks: Block[]) => Block[];
    shouldHarvest: () => boolean;
}
