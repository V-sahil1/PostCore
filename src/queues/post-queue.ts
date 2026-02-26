import { Queue } from 'bullmq';
import { redis } from '../config/redis';

const postQueue = new Queue("post", { connection: redis })