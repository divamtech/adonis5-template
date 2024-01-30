import { JobsOptions } from '@ioc:Rocketseat/Bull'
import BaseQueue from './BaseQueue'

export default class MediumPriorityJob extends BaseQueue {
  public key = BaseQueue.Queues.medium

  public options: JobsOptions = { priority: 500 }
}
