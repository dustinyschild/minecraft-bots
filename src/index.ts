import * as dotenv from 'dotenv';

import { StateMachineWebserver } from 'mineflayer-statemachine';
import * as db from './db/connect';
import { BotBase } from './BotBase';
import { BotCarrier } from './BotCarrier';
import { BotFarmer } from './BotFarmer';
import { BotSorter } from './BotSorter';
import { Bot, Farmer } from './db/schemas/bots';
import { Server } from './db/schemas/servers';
import { findOrCreateServer } from './db/daos/servers';

(async () => {
  dotenv.config();

  await db.connect();

  const server = await findOrCreateServer({
    host: process.env.HOST || 'localhost',
    port: parseInt(process.env.PORT || '') || 25565,
    version: process.env.version || '1.19.3',
  });

  const bots = await Bot.find({ server: server._id });
  const farmers = await Farmer.find({ server: server._id });

  console.log({ bots, farmers });

  // load webservers
  // workers.forEach((worker, i) => {
  //   const port = 3000 + i;

  //   const webserver = new StateMachineWebserver(
  //     worker.bot,
  //     worker.stateMachine,
  //     port,
  //   );

  //   webserver.startServer();

  //   console.log(
  //     `State machine viewer started for ${worker.bot.username} on http://localhost:${port}`,
  //   );
  // });
})();
