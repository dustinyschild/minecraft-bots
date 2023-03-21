import { Bot } from 'mineflayer';
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine';
/**
 * The bot will look at the target entity.
 */
export declare class BehaviorFollowPlayer implements StateBehavior {
    private readonly bot;
    readonly targets: StateMachineTargets;
    stateName: string;
    active: boolean;
    x?: number;
    y?: number;
    distance: number;
    constructor(bot: Bot, targets: StateMachineTargets);
    update(): void;
    /**
     * Gets the distance to the target entity.
     *
     * @returns The distance, or 0 if no target entity is assigned.
     */
    distanceToTarget(): number;
}
