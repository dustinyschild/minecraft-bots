import { StateBehavior } from 'mineflayer-statemachine/lib/statemachine';
export declare class BehaviorWait implements StateBehavior {
    stateName: string;
    active: boolean;
    finished: boolean;
    delay: number;
    constructor(delay: number);
    onStateEntered: () => void;
    isFinished: () => boolean;
}
