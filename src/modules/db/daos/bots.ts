import { FilterQuery } from 'mongoose';
import { IBot } from '../../../types';
import { Bot } from '../models';

export const create = async <T extends IBot>(input: T) => {
  return Bot.create(input);
};

export const find = async <T extends IBot>(query: FilterQuery<T>) => {
  return Bot.find(query);
};

export const findOne = async <T extends IBot>(query: FilterQuery<T>) => {
  return Bot.findOne(query);
};
