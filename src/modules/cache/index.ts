import { Redis } from 'ioredis';

const cache = new Redis();

export default cache;

export * as cacheChests from './chests';
