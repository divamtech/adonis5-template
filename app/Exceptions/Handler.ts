/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'
import { HTTPReqResTrace } from 'App/Middleware/HttpReqResLogger'
import Application from '@ioc:Adonis/Core/Application'

export default class ExceptionHandler extends HttpExceptionHandler {
  protected statusPages = {
    '401': 'errors/unauthorized',
    '403': 'errors/unauthorized',
    '404': 'errors/not-found',
    '500..599': 'errors/server-error',
  }

  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    HTTPReqResTrace.log(ctx, error)

    if (ctx.request.url().includes('api/')) {
      const nonProdPrint = Application.inProduction ? {} : { raw_error: error }
      const errorCode = error.code

      if (errorCode === 'E_INVALID_PARENT_ID_EXCEPTION') {
        return ctx.response.status(error.status || 422).json(error.body || { errors: [error.message] })
      } else if (errorCode == 'E_ACCESS_DENIED') {
        return ctx.response.status(error.status || 403).json(error.body || { errors: [error.message] })
      } else if (errorCode == 'ER_ROW_IS_REFERENCED_2') {
        return ctx.response.status(400).json({
          code: errorCode,
          message: 'Cannot delete this, because it is already reference to some other records.',
          errors: [{ rule: 'reference', field: 'id', message: 'reference validation failure' }],
          ...nonProdPrint,
        })
      } else if (errorCode == 'ER_DUP_ENTRY') {
        ctx.response.status(417).json(
          error.body || {
            code: errorCode,
            errors: [error.message],
            message: 'Duplicate entry issue, unique validation failed',
            ...nonProdPrint,
          },
        )
        this.reportErrorToServer(error, ctx)
        return
      } else if (error.status == 400 && error.constructor.name == 'SyntaxError') {
        return ctx.response.status(400).json({
          code: 'INVALID_JSON',
          message: 'Check your JSON body',
          errors: [{ rule: 'json_format', field: 'body', message: 'invalid json, processing error' }],
          ...nonProdPrint,
        })
      }

      const code = error.status || 500
      if (code == 404) {
        ctx.response.status(code).json({
          code: 'E_PAGE_NOT_FOUND',
          message: 'page not found',
          ...nonProdPrint,
        })
        this.reportErrorToServer(error, ctx)
        return
      } else if (code >= 500) {
        ctx.response.status(code).json({
          code: 'E_SOMETHING_WRONG',
          message: 'something went to wrong!',
          ...nonProdPrint,
        })
        this.reportErrorToServer(error, ctx)
        return
      }
    }
    super.handle(error, ctx)
    this.reportErrorToServer(error, ctx)
  }

  reportErrorToServer(error: any, ctx: HttpContextContract) {
    try {
      const statusCode = ctx.response.getStatus()
      if (statusCode > 403 && statusCode != 422 && process.env.ERROR_REPORTING_SERVER_ENDPOINT && process.env.ERROR_REPORTING_SERVER_TOKEN) {
        const errorStack = error?.stack?.split('\n')
        const request_header = ctx.request.headers()
        if (process.env.NODE_ENV == 'production') {
          request_header.authorization = request_header.authorization
            ?.split(' ')
            .map((a) => (a == 'Bearer' || a == 'bearer' ? a : '<auth_token>'))
            .join(' ')
        }
        const payload = {
          response_status_code: statusCode,
          error_status_code: error?.status,
          method: ctx.request.method(),
          host: ctx.request.host() || 'unknown',
          route: ctx.request.url(true),
          request_header,
          request_body: ctx.request.all(),
          response_body: ctx.response.getBody(),
          raw_error: error,
          errorStack,
          NODE_ENV: process.env.NODE_ENV,
          ips: ctx.request.ips(),
        }

        axios.post(process.env.ERROR_REPORTING_SERVER_ENDPOINT, payload, {
          headers: { Authorization: `Bearer ${process.env.ERROR_REPORTING_SERVER_TOKEN}` },
        })
      }
    } catch (e) {}
  }
}
