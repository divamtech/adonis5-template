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
    if (ctx.request.header('content-type')?.startsWith('application/json')) {
      const code = error?.status || 500
      if (code == 404) {
        return ctx.response.status(code).json({
          code,
          message: 'page not found',
          ...(process.env.NODE_ENV == 'production' ? {} : { raw_error: error })
        })
      }

      if (error.code === 'E_INVALID_PARENT_ID_EXCEPTION') {
        return ctx.response.status(error.status || 422).json(error.body || { errors: [error.message] })
      } else if (error.code == 'ER_ROW_IS_REFERENCED_2') {
        return ctx.response.status(400).json({
          code: error.code,
          message: 'Cannot delete this, because it is already reference to some other record',
          errors: [error.message],
          ...(process.env.NODE_ENV == 'production' ? {} : { raw_error: error })
        })
      }

      if (code >= 500) {
        return ctx.response.status(code).json({
          code: 'E_SOMETHING_WRONG',
          message: 'something went to wrong!',
          ...(process.env.NODE_ENV == 'production' ? {} : { raw_error: error })
        })
      }
    }
    return super.handle(error, ctx)
  }
}
