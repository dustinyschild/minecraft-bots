import { BotBase } from './BotBase';
import { BotCarrier } from './BotCarrier';
import { BotFarmer } from './BotFarmer';
import { BotSorter } from './BotSorter';

const targetServer = {
  host: 'localhost',
  port: 25565,
  version: '1.19.3',
};

// new BotBase({ ...targetServer, username: 'based_bot' });
// new BotFarmer({ ...targetServer, username: 'farmer' });
// new BotSorter({ ...targetServer, username: 'sorter' });
new BotCarrier({ ...targetServer, username: 'randy' });
