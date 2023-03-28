import mongoose from 'mongoose';
import { Bot } from './schemas/bots';

const createBot = async (options: any) => {
  await Bot.create(options).then((bot) => {
    console.log(`Created ${bot.username} as type ${bot.type}.`);
  });
};

const createFarmer = async (options: any) => {
  await Bot.create({ ...options, type: 'farmer' }).then(() => {
    console.log(`farmer created!`);
  });
};

export const connect = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/minecraft').then(() => {
    console.log('Connected to: mongodb://localhost:27017/minecraft');
  });
};

export const disconnect = async () => {
  await mongoose.disconnect();
};
