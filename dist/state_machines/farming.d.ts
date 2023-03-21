import { Bot } from 'mineflayer';
import { NestedStateMachine } from 'mineflayer-statemachine';
import { FarmerConfig } from '../types/farmer';
export declare const loadFarmingStateMachine: (bot: Bot, config: FarmerConfig) => NestedStateMachine;
