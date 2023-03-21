import { BotOptions } from 'mineflayer';
import { Field } from '../types/farmer';
import { BotStateMachine, StateMachineWebserver } from 'mineflayer-statemachine';
import { BotBase } from '../BotBase';
export declare class BotFarmer extends BotBase {
    debugMode: boolean;
    fields: Field[];
    isFarming: boolean;
    harvestThreshold: number;
    stateMachine: BotStateMachine;
    stateMachineServer: StateMachineWebserver;
    constructor(options: BotOptions);
}
