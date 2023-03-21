import { readFileSync } from 'fs';
import { BaseConfigs } from '../types/base';
import { CarrierConfigs } from '../types/carier';
import { FarmerConfigs } from '../types/farmer';
import { SorterConfigs } from '../types/sorter';

// import config files for typescript compiler
import _farmersConfig from './farmers.json';
import _sortersConfig from './sorters.json';
import _carriersConfig from './carriers.json';

export const loadBaseConfig = (username: string) => {
  const farmerData = readFileSync(`${__dirname}/base.json`);

  const config = JSON.parse(farmerData.toString('utf-8')) as BaseConfigs;

  return config[username];
};

export const loadFarmerConfig = (username: string) => {
  const farmerData = readFileSync(`${__dirname}/farmers.json`);

  const config = JSON.parse(farmerData.toString('utf-8')) as FarmerConfigs;

  if (config[username]) {
    return config[username];
  } else {
    throw Error(`No config found for: ${username}`);
  }
};

export const loadSorterConfig = (username: string) => {
  const sorterData = readFileSync(`${__dirname}/sorters.json`);

  const config = JSON.parse(sorterData.toString('utf-8')) as SorterConfigs;

  if (config[username]) {
    return config[username];
  } else {
    throw Error(`No config found for: ${username}`);
  }
};

export const loadCarrierConfig = (username: string) => {
  const carrierData = readFileSync(`${__dirname}/carriers.json`);

  const config = JSON.parse(carrierData.toString('utf-8')) as CarrierConfigs;

  if (config[username]) {
    return config[username];
  } else {
    throw Error(`No config found for: ${username}`);
  }
};
