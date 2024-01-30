import { DateTime } from 'luxon'
import { BaseModel, ModelAttributes, column } from '@ioc:Adonis/Lucid/Orm'
import Bull from '@ioc:Rocketseat/Bull'
import { BullQueue } from 'Contracts/const'
import BaseQueue from 'App/Jobs/BaseQueue'
import Logger from '@ioc:Adonis/Core/Logger'

export default class Base extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public serializeExtras() {
    return this.$extras
  }

  /**
   * ORDER:
   * 1. database keys
   * 2. relationships?
   * 3. serialize method?
   * 4. hooks methods?
   * 5. scope?
   * 6. methods?
   */

  public get constructorName() {
    return this.constructor.name
  }

  public static defaultMeta(obj = {}) {
    const defaultData = { total: 1, per_page: 0, current_page: 1, last_page: 1, first_page: 1 }
    return { ...defaultData, ...obj }
  }

  public static defaultPaginate(data) {
    return { data, meta: { per_page: data.length, total: data.length, current_page: 1, last_page: 1, first_page: 1 } }
  }

  public clone() {
    //@ts-ignore
    const obj = new this.constructor()
    obj.$attributes = { ...this.$attributes }
    obj.$extras = { ...this.$extras }
    /**
     * Relationships toObject
     */
    obj.$preloaded = Object.keys(this.$preloaded).reduce((result, key) => {
      const value = this.$preloaded[key] as Base | Base[]
      result[key] = Array.isArray(value) ? value.map((one) => one.clone()) : value.clone()
      return result
    }, {})
    return obj
  }

  //yyyy-MM-dd
  public static parseDateAsSQLDate(d): string {
    return d?.constructor?.name === 'DateTime' ? d.toISODate() : d
  }

  //yyyy-MM-dd
  public static serializeDateAsSQLDateString(d): string {
    if (d?.constructor?.name === 'DateTime') {
      return d.toISODate()
    } else if (d?.constructor?.name === 'Date') {
      return d.toISOString().split('T')[0]
    }
    return d
  }

  static COLUMN_AMOUNT = { consume: parseFloat }
  static COLUMN_DATE = { prepare: Base.parseDateAsSQLDate, serialize: Base.serializeDateAsSQLDateString }
  static TO_UPPERCASE = { prepare: (v) => (!!v ? v.toUpperCase() : v) }
  static CONSUMER_TO_BOOLEAN = { consume: (v) => v == 1 }
  static To_JSON = (dv: any = null) => ({ prepare: (value) => (value ? JSON.stringify(value) : dv) })

  static get logger() {
    return Logger
  }

  //BULL JOBS
  static get queue() {
    return BullQueue
  }

  static get tasks() {
    return BaseQueue.tasks
  }

  static async addTask(queueName: string, taskName: string, payload = {}, options = {}) {
    try {
      await Bull.add(queueName, { taskName, payload }, options)
    } catch (err) {
      this.logger.error({ err }, 'job scheduling error')
    }
  }

  static get serializeKeys() {
    return this.$keys.serializedToAttributes.all()
  }

  static get allKeys() {
    return Object.keys(this.serializeKeys)
  }

  static filterData(data: HashType, exceptKeys: string[] = []): HashType {
    return this.allKeys.reduce((acc, k) => {
      if (!exceptKeys.includes(k) && data[k]) {
        acc[k] = data[k]
      }
      return acc
    }, {})
  }

  get static() {
    return this.constructor as typeof Base
  }

  filterData(data: HashType, exceptKeys: string[] = []): Partial<ModelAttributes<this>> {
    return this.static.filterData(data, exceptKeys) as Partial<ModelAttributes<this>>
  }

  filterAndFill(data: HashType, exceptKeys: string[] = []) {
    const filterData = this.filterData(data, exceptKeys)
    this.fill(filterData)
    return this
  }

  filterAndMerge(data: HashType, exceptKeys: string[] = []) {
    const filterData = this.filterData(data, exceptKeys)
    this.merge(filterData)
    return this
  }
}
