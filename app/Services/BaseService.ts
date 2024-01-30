import Bull from '@ioc:Rocketseat/Bull'
import { BullQueue } from 'Contracts/const'
import BaseQueue from 'App/Jobs/BaseQueue'
import Logger from '@ioc:Adonis/Core/Logger'
import { ValidationException } from '@ioc:Adonis/Core/Validator'

export default class BaseService {
  get logger() {
    return Logger
  }

  get queue() {
    return BullQueue
  }

  get tasks() {
    return BaseQueue.tasks
  }

  async addTask(queueName: string, taskName: string, payload = {}) {
    try {
      await Bull.add(queueName, { taskName, payload })
    } catch (err) {
      this.logger.error({ err }, 'job scheduling error')
    }
  }

  public throwValidationError(code: string, message: string, data?: any, args?: any) {
    throw new ValidationException(false, { code, message, errors: [{ message }], data, args })
  }
}
