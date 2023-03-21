"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCarrierConfig = exports.loadSorterConfig = exports.loadFarmerConfig = exports.loadBaseConfig = void 0;
const fs_1 = require("fs");
const loadBaseConfig = (username) => {
    const farmerData = (0, fs_1.readFileSync)(`${__dirname}/base.json`);
    const config = JSON.parse(farmerData.toString('utf-8'));
    return config[username];
};
exports.loadBaseConfig = loadBaseConfig;
const loadFarmerConfig = (username) => {
    const farmerData = (0, fs_1.readFileSync)(`${__dirname}/farmers.json`);
    const config = JSON.parse(farmerData.toString('utf-8'));
    if (config[username]) {
        return config[username];
    }
    else {
        throw Error(`No config found for: ${username}`);
    }
};
exports.loadFarmerConfig = loadFarmerConfig;
const loadSorterConfig = (username) => {
    const sorterData = (0, fs_1.readFileSync)(`${__dirname}/sorters.json`);
    const config = JSON.parse(sorterData.toString('utf-8'));
    if (config[username]) {
        return config[username];
    }
    else {
        throw Error(`No config found for: ${username}`);
    }
};
exports.loadSorterConfig = loadSorterConfig;
const loadCarrierConfig = (username) => {
    const carrierData = (0, fs_1.readFileSync)(`${__dirname}/carriers.json`);
    const config = JSON.parse(carrierData.toString('utf-8'));
    if (config[username]) {
        return config[username];
    }
    else {
        throw Error(`No config found for: ${username}`);
    }
};
exports.loadCarrierConfig = loadCarrierConfig;
//# sourceMappingURL=index.js.map