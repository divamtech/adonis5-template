import { JobsOptions } from '@ioc:Rocketseat/Bull'
import BaseQueue from './BaseQueue'

export default class LowPriorityJob extends BaseQueue {
  public key = BaseQueue.Queues.low

  public options: JobsOptions = { priority: 1000 }
}
