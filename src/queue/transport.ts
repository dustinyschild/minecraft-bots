import { Queue } from 'bullmq';
import connection from './connection';
import { QueueType } from '../types/queue';

export const transportQueue = new Queue(QueueType.TRANSPORT, { connection });
