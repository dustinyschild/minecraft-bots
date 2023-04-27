import * as dotenv from 'dotenv';

import * as db from './db/connect';
import { loadBots } from './loaders';
import bootstrap from './api/main';

(async () => {
  dotenv.config();

  // await db.connect();

  await bootstrap();

  // const bots = await loadBots({
  //   host: process.env.HOST || 'localhost',
  //   port: parseInt(process.env.PORT || '') || 25565,
  //   version: process.env.version || '1.19.3',
  // });
})();
