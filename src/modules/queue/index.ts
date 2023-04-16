import { Redis } from 'ioredis';

const queueConnection = new Redis();

export default queueConnection;
