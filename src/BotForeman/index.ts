/*
  need to create a bot to oversee the other bots. It won't do any actual work.

  this bot will handle some of the interfacing with real players, such as config changes and bot assignments


  TODO:
    - tell bots whether to sleep or log
      - tell bot to log in
*/

import { BotBase } from '../BotBase';
import { IServer } from '../types';
import { IFarmer } from '../types/farmer';

export class BotForeman extends BotBase {
  stateMachine;

  constructor({ host, port, version }: IServer, config: IFarmer) {
    super({ username: config.username, host, port, version });

    this.stateMachine = this.loadStateMachines([]);
  }
}
