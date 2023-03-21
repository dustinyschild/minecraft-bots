import { Bot } from 'mineflayer';
import { StateBehavior } from 'mineflayer-statemachine';
import { Vec3 } from 'vec3';
import { Farm } from '../types';
interface Drop {
    id: string;
    position: Vec3;
}
export declare class BehaviorGatherDrops implements StateBehavior {
    stateName: string;
    active: boolean;
    bot: Bot;
    field: Farm;
    drops: Drop[];
    startGoal: Vec3;
    startingGoalReached: boolean;
    endGoal: Vec3;
    endingGoalReached: boolean;
    constructor(bot: Bot, field: Farm);
    onStateEntered: () => void;
    update: () => void;
    locateDrops: () => {
        id: string;
        position: Vec3;
    }[];
    resumeWalkingArea: () => void;
}
export {};
