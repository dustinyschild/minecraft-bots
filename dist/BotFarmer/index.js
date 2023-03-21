"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotFarmer = void 0;
const configs_1 = require("../configs");
const mineflayer_statemachine_1 = require("mineflayer-statemachine");
const farming_1 = require("../state_machines/farming");
const BotBase_1 = require("../BotBase");
class BotFarmer extends BotBase_1.BotBase {
    constructor(options) {
        super(options);
        this.debugMode = true;
        this.isFarming = false;
        this.harvestThreshold = 0.5;
        const config = (0, configs_1.loadFarmerConfig)(options.username);
        const behaviorIdle = new mineflayer_statemachine_1.BehaviorIdle();
        behaviorIdle.stateName = 'Idle';
        const farmingStateMachine = (0, farming_1.loadFarmingStateMachine)(this.bot, config);
        farmingStateMachine.stateName = 'Farm';
        const rootStateMachine = new mineflayer_statemachine_1.NestedStateMachine([
            // behaviorIdle => behaviorCheckFields
            new mineflayer_statemachine_1.StateTransition({
                parent: behaviorIdle,
                child: farmingStateMachine,
            }),
        ], behaviorIdle);
        rootStateMachine.stateName = 'Root';
        this.stateMachine = new mineflayer_statemachine_1.BotStateMachine(this.bot, rootStateMachine);
        this.stateMachineServer = new mineflayer_statemachine_1.StateMachineWebserver(this.bot, this.stateMachine);
        this.stateMachineServer.startServer();
        this.fields = config.fields;
    }
}
exports.BotFarmer = BotFarmer;
//# sourceMappingURL=index.js.map