import { StateMachineWebserver } from 'mineflayer-statemachine';
import { BotBase } from './BotBase';
import { BotCarrier } from './BotCarrier';
import { BotFarmer } from './BotFarmer';
import { BotSorter } from './BotSorter';

const targetServer = {
  host: 'localhost',
  port: 25565,
  version: '1.19.3',
};

const workers = [
  new BotFarmer({ ...targetServer, username: 'farmer' }),
  // new BotSorter({ ...targetServer, username: 'sorter' }),
  // new BotCarrier({ ...targetServer, username: 'randy' }),
];

// load webservers
workers.forEach((worker, i) => {
  const port = 3000 + i;

  const webserver = new StateMachineWebserver(
    worker.bot,
    worker.stateMachine,
    port,
  );

  webserver.startServer();

  console.log(
    `State machine viewer started for ${worker.bot.username} on http://localhost:${port}`,
  );
});
