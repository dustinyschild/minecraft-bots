import { Queue } from 'bullmq';
import queueConnection from '.';
import { QueueType } from '../../types/queue';

export const transportQueue = new Queue(QueueType.TRANSPORT, {
  connection: queueConnection,
});
