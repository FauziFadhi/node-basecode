import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class AppService {
  constructor(
    @InjectQueue('audio')
    private readonly queue: Queue,
  ) {

  }

  getHello() {
    for (let index = 0; index < 10; index++) {
      this.queue.add({ hello: 'world' });
    }
    return 'Hello World!';
  }
}
