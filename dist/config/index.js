"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = void 0;
const sorters_json_1 = __importDefault(require("./sorters.json"));
const loadConfig = (type, username) => {
    switch (type) {
        case 'farmer':
            console.log('load farmer config');
        case 'sorter':
            return sorters_json_1.default[username];
        default:
            throw Error(`No configs found for bot type: ${type}`);
    }
};
exports.loadConfig = loadConfig;
//# sourceMappingURL=index.js.map