import { BotOptions } from 'mineflayer';
import { Worker, Job } from 'bullmq';
import { BotBase } from '../BotBase';
import { loadCarrierConfig } from '../configs';
import { QueueType } from '../types/queue';
import { TransportJob } from '../state_machines/transport';
import { timeIn } from '../helpers';

/* for bulk item transport */
export class BotCarrier extends BotBase {
  stateMachine;
  worker: Worker;

  constructor(options: BotOptions) {
    super(options);

    const config = loadCarrierConfig(options.username);

    const transportJob = new TransportJob(this.bot, config.depositChests, {
      waitTime: timeIn.seconds(10),
    });

    this.worker = new Worker(QueueType.TRANSPORT, transportJob.processor, {
      autorun: false,
      concurrency: 1,
      removeOnComplete: { count: 0 },
    });

    this.stateMachine = this.loadStateMachines([]);

    this.bot.on('spawn', async () => {
      await this.worker.run();
    });
  }
}
