import mongoose, { ObjectId } from 'mongoose';

export interface IServer {
  host: string;
  port: number;
  version: string;
}

export interface IBot {
  _id: ObjectId;
  username: string;
  type: 'none' | 'farmer' | 'sorter' | 'courier' | 'carrier';
  server: mongoose.Schema.Types.ObjectId;
}

export type ICoordinate = [number, number, number];

export type IBoundary = [ICoordinate, ICoordinate];

// helper type since this.bot.registry.itemsByName doesn't have type support
export interface ItemRegistry {
  [key: string]: {
    id: number;
    name: string;
    displayName: string;
    stackSize: number;
  };
}

export interface BotChest {
  position: ICoordinate;
  items?: string[];
}

export type ChatCommand = (
  username: string,
  commandArgs: string[],
) => Promise<void> | void;

export interface BotCommandDictionary {
  [command: string]: ChatCommand;
}
