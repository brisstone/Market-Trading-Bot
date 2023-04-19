import { Queue, Worker, Job as BullJob } from "bullmq";

// starts the job at initiation
export const connectQueue = (name: string) =>
  new Queue(name, {
    connection: {
      host: `${process.env.REDIS_HOST}`,
      port: parseInt(`${process?.env?.REDIS_PORT}`),
      password: `${process.env.REDIS_PASSWORD}`,
    },
  });

//Worker to Run queued job
export const queueWorker = (name: string, task: any) =>
  new Worker(
    name,
    async (job: BullJob) => {
      await task(job);
    },
    {
      connection: {
        host: `${process.env.REDIS_HOST}`,
        port: parseInt(`${process?.env?.REDIS_PORT}`),
        password: `${process.env.REDIS_PASSWORD}`,
      },
    }
  );
