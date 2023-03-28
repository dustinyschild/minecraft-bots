import { IServer } from '../types';
import { connect, disconnect } from './connect';
import { findOrCreate } from './daos/servers';
import { Bot, Farmer } from './schemas/bots';

import * as dotenv from 'dotenv';
dotenv.config();

const serverConfig: IServer = {
  host: process.env.host || 'localhost',
  port: parseInt(process.env.port || '') || 25565,
  version: process.env.version || '1.19.3',
};

const logCreated = (bot: any) => {
  console.log(`Created ${bot.username} as type ${bot.type}.`);
};

const createBase = async () => {
  const server = await findOrCreate(serverConfig);

  await Bot.create({
    username: 'jack_o_trades',
    server: server._id,
  }).then(logCreated);
};

const createFarmer = async () => {
  const server = await findOrCreate(serverConfig);

  await Farmer.create({
    username: 'farmer_john',
    server: server._id,
    standByPosition: [-16, -60, 36],
    fields: [
      {
        boundary: [
          [-13, -60, 37],
          [-5, -60, 45],
        ],
        block: 'wheat',
        crop: 'wheat',
        seed: 'wheat_seeds',
        maturity: 7,
        depositChests: [
          {
            position: [-14, -60, 35],
            items: ['wheat'],
          },
          {
            position: [-13, -60, 35],
            items: ['wheat_seeds'],
          },
        ],
      },
      {
        boundary: [
          [-3, -60, 35],
          [5, -60, 45],
        ],
        block: 'carrots',
        crop: 'carrot',
        seed: 'carrot',
        maturity: 7,
        depositChests: [
          {
            position: [-4, -60, 35],
            items: ['carrot'],
          },
        ],
      },
      {
        boundary: [
          [7, -60, 37],
          [15, -60, 45],
        ],
        block: 'beetroots',
        crop: 'beetroot',
        seed: 'beetroot_seeds',
        maturity: 7,
        depositChests: [
          {
            position: [6, -60, 35],
            items: ['beetroot'],
          },
          {
            position: [7, -60, 35],
            items: ['beetroot_seeds'],
          },
        ],
      },
      {
        boundary: [
          [17, -60, 37],
          [25, -60, 45],
        ],
        block: 'potatoes',
        crop: 'potato',
        seed: 'potato',
        maturity: 7,
        depositChests: [
          {
            position: [16, -60, 35],
            items: ['potato'],
          },
          {
            position: [17, -60, 35],
            items: ['poisonous_potato'],
          },
        ],
      },
    ],
  }).then(logCreated);
};

// DROP COLLECTIONS AND CREATE NEW
(async () => {
  await connect();

  await createBase();
  await createFarmer();

  await disconnect();
})();
