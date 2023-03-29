import { BotFarmer } from './BotFarmer';
import * as servers from './daos/servers';
import * as farmers from './daos/farmers';
import { IServer } from './types';

export const loadBots = async (targetServer: IServer) => {
  const server = await servers.findOne(targetServer);

  if (!server) {
    throw Error('Server record not found');
  }

  const farmerRecords = await farmers.find({ server });

  return farmerRecords.map((record) => new BotFarmer(server, record));
};
