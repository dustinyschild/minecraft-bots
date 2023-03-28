import { IServer } from '../../types';
import { Server } from '../schemas/servers';

export const findOrCreate = async (target: IServer) => {
  let server = await Server.findOne({
    host: target.host,
    port: target.port,
  });

  if (!server) {
    server = await Server.create(target);
  } else if (target.version && server.version !== target.version) {
    // invalid version
    throw Error('Targeted version does not match document version.');
  }

  return server;
};
