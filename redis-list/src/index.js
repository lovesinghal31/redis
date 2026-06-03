import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const QUEUE_KEY = 'queue:emails';

app.post('/emails', async (req, res) => {
  const job = {
    to: req.body.to,
    subject: req.body.subject || 'No Subject',
    body: req.body.body || 'No Body',
    createdAt: new Date().toISOString(),
  };
  await redis.lpush(QUEUE_KEY, JSON.stringify(job));
  res.status(201).json({ queue: true, job });
});

app.get('/emails/process-one', async (req, res) => {
  const rawJob = await redis.rpop(QUEUE_KEY);
  if (!rawJob) {
    return res.status(200).json({ message: 'No jobs in the queue' });
  }
  const job = JSON.parse(rawJob);
  // Simulate email sending
  console.log(`Processing email to: ${job.to}, subject: ${job.subject}`);
  res.status(200).json({ processed: true, job });
});

app.listen(3000, () => {
  console.log('Email queue server running on http://localhost:3000');
});
