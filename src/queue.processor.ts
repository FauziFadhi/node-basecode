import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('audio')
export class QueueProcessor {
  @Process({ concurrency: 1 })
  async processor(job: Job<unknown>) {
    console.log(job);
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
    throw new Error('asd');
  }
}
