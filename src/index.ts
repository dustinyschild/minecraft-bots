import * as dotenv from 'dotenv';
import * as db from './modules/db/connect';
import { loadBots } from './loaders';

(async () => {
  dotenv.config();

  await db.connect();

  const bots = await loadBots({
    host: process.env.HOST || 'localhost',
    port: parseInt(process.env.PORT || '') || 25565,
    version: process.env.version || '1.19.3',
  });

  bots.forEach((bot) => console.log(bot.bot.username));

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
