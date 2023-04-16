import { model } from 'mongoose';
import { botSchema, farmerSchema } from './schemas/bots';
import { serverSchema } from './schemas/servers';
import { IBot, IServer } from '../../types';
import { IFarmer } from '../../types/farmer';

export type ServerDocument = IServer & Document;
export const Server = model<ServerDocument>('Server', serverSchema);

export type BotDocument<T extends IBot> = T & Document;
export const Bot = model<BotDocument<IBot>>('Bot', botSchema);
export const Farmer = Bot.discriminator<BotDocument<IFarmer>>(
  'Farmer',
  farmerSchema,
);
