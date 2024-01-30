import { JobContract } from '@ioc:Rocketseat/Bull'

export default class BaseTask implements JobContract {
  public key = this.constructor.name

  public async handle(job) {}
}
