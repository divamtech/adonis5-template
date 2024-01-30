import { JobsOptions } from '@ioc:Rocketseat/Bull'
import BaseQueue from './BaseQueue'

export default class HighPriorityJob extends BaseQueue {
  public key = BaseQueue.Queues.high

  public options: JobsOptions = { priority: 1 }
}

