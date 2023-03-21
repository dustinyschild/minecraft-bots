import { Bot } from 'mineflayer';
import { Movements } from 'mineflayer-pathfinder';
import { StateBehavior } from 'mineflayer-statemachine';
import { Vec3 } from 'vec3';
export declare class BehaviorStandBy implements StateBehavior {
    stateName: string;
    active: boolean;
    private readonly bot;
    movements: Movements;
    position: Vec3;
    finished: boolean;
    constructor(bot: Bot, position: Vec3);
    onStateEntered: () => void;
    isFinished: () => boolean;
}
