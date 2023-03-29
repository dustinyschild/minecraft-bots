import { model } from 'mongoose';
import { IBot, IServer } from '../types';
import { IFarmer } from '../types/farmer';
import { botSchema, farmerSchema } from './schemas/bots';
import { serverSchema } from './schemas/servers';

export type ServerDocument = IServer & Document;
export const Server = model<ServerDocument>('Server', serverSchema);

export type BotDocument<T extends IBot> = T & Document;
export const Bot = model<BotDocument<IBot>>('Bot', botSchema);
export const Farmer = Bot.discriminator<BotDocument<IFarmer>>(
  'farmer',
  farmerSchema,
);
