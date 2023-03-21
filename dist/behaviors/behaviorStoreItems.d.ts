import { Bot } from 'mineflayer';
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine';
import { Field } from '../types/farmer';
export declare class BehaviorStoreItems implements StateBehavior {
    stateName: string;
    active: boolean;
    bot: Bot;
    targets: StateMachineTargets;
    finished: boolean;
    constructor(bot: Bot, targets: StateMachineTargets);
    onStateEntered: () => Promise<void>;
    onStateExited: () => void;
    store: (field: Field) => Promise<void>;
    isFinished: () => boolean;
}
