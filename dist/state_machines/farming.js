"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFarmingStateMachine = void 0;
const mineflayer_statemachine_1 = require("mineflayer-statemachine");
const vec3_1 = require("vec3");
const behaviors_1 = require("../behaviors");
const config_1 = require("../config");
const helpers_1 = require("../helpers");
const loadFarmingStateMachine = (bot, config) => {
    const targets = {
        item: {
            waitUntilTime: null,
            fieldToHarvest: null,
            crops: config_1.crops,
        },
    };
    const behaviorWait = new behaviors_1.BehaviorWait(helpers_1.timeIn.seconds(3));
    behaviorWait.stateName = 'Wait';
    const behaviorStandBy = new behaviors_1.BehaviorStandBy(bot, new vec3_1.Vec3(-15, -60, -6));
    const behaviorCheckFields = new behaviors_1.BehaviorCheckFields(bot, targets, config.fields);
    const behaviorHarvestField = new behaviors_1.BehaviorHarvestField(bot, targets);
    const behaviorSowField = new behaviors_1.BehaviorSowField(bot, targets);
    const behaviorStoreItems = new behaviors_1.BehaviorStoreItems(bot, targets);
    const transitions = [
        // behaviorCheckFields => behaviorWait
        new mineflayer_statemachine_1.StateTransition({
            parent: behaviorCheckFields,
            child: behaviorWait,
            shouldTransition: () => bot.entity.position.distanceTo(behaviorStandBy.position) < 1,
        }),
        // behaviorCheckFields => behaviorStandBy
        new mineflayer_statemachine_1.StateTransition({
            parent: behaviorCheckFields,
            child: behaviorStandBy,
            shouldTransition: () => !targets.item.fieldToHarvest,
        }),
        // behaviorCheckFields => behaviorHarvestField
        new mineflayer_statemachine_1.StateTransition({
            parent: behaviorCheckFields,
            child: behaviorHarvestField,
            shouldTransition: () => targets.item.fieldToHarvest,
        }),
        // behaviorHarvestField => behaviorSowField
        new mineflayer_statemachine_1.StateTransition({
            parent: behaviorHarvestField,
            child: behaviorSowField,
            shouldTransition: behaviorHarvestField.isFinished,
        }),
        // behaviorSowField => behaviorStoreItems
        new mineflayer_statemachine_1.StateTransition({
            parent: behaviorSowField,
            child: behaviorStoreItems,
            shouldTransition: behaviorSowField.isFinished,
        }),
        // behaviorStoreItems => behaviorCheckFields
        new mineflayer_statemachine_1.StateTransition({
            parent: behaviorStoreItems,
            child: behaviorCheckFields,
            shouldTransition: behaviorStoreItems.isFinished,
        }),
        // behaviorStandBy => behaviorWait
        new mineflayer_statemachine_1.StateTransition({
            parent: behaviorStandBy,
            child: behaviorWait,
            shouldTransition: behaviorStandBy.isFinished,
        }),
        // behaviorWait => behaviorCheckFields
        new mineflayer_statemachine_1.StateTransition({
            parent: behaviorWait,
            child: behaviorCheckFields,
            shouldTransition: behaviorWait.isFinished,
        }),
    ];
    const farmingStateMachine = new mineflayer_statemachine_1.NestedStateMachine(transitions, behaviorCheckFields);
    farmingStateMachine.stateName = 'Farm';
    return farmingStateMachine;
};
exports.loadFarmingStateMachine = loadFarmingStateMachine;
//# sourceMappingURL=farming.js.map