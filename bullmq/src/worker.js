import { Worker } from 'bullmq';
import { connection } from './queue.js';

const emailWorker = new Worker(
  'emails',
  async (job) => {
    console.log(`Processing job ${job.id} with data:`, job.name, job.data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Job ${job.id} completed.`);
  },
  { connection },
);

emailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} has been completed by the first worker.`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error (first worker):`, err);
});

console.log('Email workers are running...');
