import { FilterQuery } from 'mongoose';
import { IFarmer } from '../../../types/farmer';
import { Farmer } from '../models';

export const create = async (input: IFarmer) => {
  return Farmer.create(input);
};

export const find = async (query: FilterQuery<IFarmer>) => {
  return Farmer.find(query);
};

export const findOne = async (query: FilterQuery<IFarmer>) => {
  return Farmer.findOne(query);
};
