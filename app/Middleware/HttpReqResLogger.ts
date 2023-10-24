import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HttpReqResLogger {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    try {
      await next()
    } finally {
      HTTPReqResTrace.log(ctx)
    }
  }
}

const prettyMs = require('pretty-ms')
const onFinished = require('on-finished')

export class HTTPReqResTrace {
  private request
  private res
  private Logger

  constructor(private ctx: HttpContextContract, private err = null) {
    this.request = ctx.request
    this.res = ctx.request.response
    this.Logger = ctx.logger
  }

  /**
   * Returns the diff in milliseconds using process.hrtime. Started
   * at time is required
   *
   * @method _diffHrTime
   *
   * @param  {Array}    startedAt
   *
   * @return {Number}
   *
   * @private
   */
  _diffHrTime(startedAt) {
    const diff = process.hrtime(startedAt)
    return (diff[0] * 1e9 + diff[1]) / 1e6
  }

  /**
   * Returns the log level based on the status code
   *
   * @method _getLogLevel
   *
   * @param  {Number}     statusCode
   *
   * @return {String}
   *
   * @private
   */
  _getLogLevel(statusCode) {
    if (statusCode >= 400 && statusCode < 600) {
      return 'error'
    }

    return Application.inProduction ? 'debug' : 'info'
  }

  /**
   * Logs http request using the Adonis inbuilt logger
   *
   * @method log
   *
   * @param  {String} url
   * @param  {String} method
   * @param  {Number} statusCode
   * @param  {Array} startedAt
   * @param  {String} code
   *
   * @return {void}
   */
  log(url, method, statusCode, startedAt, handlerError) {
    const time = prettyMs(this._diffHrTime(startedAt))
    const logLevel = this._getLogLevel(statusCode)

    const moreInfo: { [key: string]: any } = { error: this.err, handlerError }

    if (!Application.inProduction) {
      const nonProdPrint = {
        moreInfo,
        method,
        statusCode,
        url,
        time,
        headers: this.ctx.request.headers(),
        body: this.ctx.request.all(),
        response: this.ctx.response.getBody(),
      }
      this.Logger[logLevel]('request:: %s', JSON.stringify(nonProdPrint, null, 2))
    }

    this.Logger[logLevel]('Request:: method:%s, statusCode:%s, url:%s, time:%s, moreInfo:%o', method, statusCode, url, time, moreInfo)
  }

  /**
   * Binds the hook to listen for finish event
   *
   * @method hook
   *
   * @return {void}
   */
  hook() {
    const start = process.hrtime()
    const url = this.request.url()
    const method = this.request.method()

    onFinished(this.res, (error, res) => {
      this.log(url, method, res.statusCode, start, error)
    })
  }

  static log(ctx, err = null) {
    const l = new HTTPReqResTrace(ctx, err)
    l.hook()
  }
}
