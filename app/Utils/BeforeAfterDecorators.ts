/**
 * BeforeAfterDecorators is inspired by rails style before and after action
 * as method action decorator named as `before` and `after`
 * and class action decorator named as `Before` and `After`
 *
 * method to exclude automatically use prefix `before` or `after` or `_`
 *
 * @NOTE If found error as `Maximum call stack size exceeded` means you are using some decorators from here, and the name of the decorator not starting with either of one('before', 'after', '_')
 *        In simple just use method naming convention starting from either `before` or `after` or `_`
 *        Name start from `before` or `after` or `_` is automatically in categories of except.
 *
 * See the example at below before use.
 *
 *
 * function which takes as string arguments must exist and format like:
 *  `(HttpContextContract) => (Promise<boolean> | boolean)`
 */


import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 *
 * Applies on instance method
 * @param method should present in class or except raised
 * @param params either pass nothing or only applied method or after applied method or both if you want (rare used)
 * @returns nothing
 *
 * @NOTE If found error as `Maximum call stack size exceeded` means you are using some decorators from here, and the name of the decorator not starting with either of one('before', 'after', '_')
 *        In simple just use method naming convention starting from either `before` or `after` or `_`
 *        Name start from `before` or `after` or `_` is automatically in categories of except.
 */
const before = function (bfn: string) {
  return function (_0: any, _1: string, descriptor: PropertyDescriptor) {
    const fn = descriptor.value
    if (typeof fn == 'function') {
      descriptor.value = async function (ctx: HttpContextContract) {
        if (await this[bfn].call(this, ctx)) {
          return fn.call(this, ctx)
        }
      }
    }
    return descriptor
  }
}

/**
 *
 * Applies on instance method
 * @param method should present in class or except raised
 * @param params either pass nothing or only applied method or after applied method or both if you want (rare used)
 * @returns nothing
 *
 * @NOTE If found error as `Maximum call stack size exceeded` means you are using some decorators from here, and the name of the decorator not starting with either of one('before', 'after', '_')
 *        In simple just use method naming convention starting from either `before` or `after` or `_`
 *        Name start from `before` or `after` or `_` is automatically in categories of except.
 */
const after = function (bfn: string) {
  return function (_0: any, _1: string, descriptor: PropertyDescriptor) {
    const fn = descriptor.value
    if (typeof fn == 'function') {
      descriptor.value = async function (ctx: HttpContextContract) {
        await fn.call(this, ctx)
        return this[bfn].call(this, ctx)
      }
    }
    return descriptor
  }
}

interface IParam {
  only?: string[];
  except?: string[];
}
const defaultParam = { only: [], except: [] }

/**
 *
 * Applies on class
 * @param method should present in class or except raised
 * @param params either pass nothing or only applied method or after applied method or both if you want (rare used)
 * @returns nothing
 *
 * @NOTE If found error as `Maximum call stack size exceeded` means you are using some decorators from here, and the name of the decorator not starting with either of one('before', 'after', '_')
 *        In simple just use method naming convention starting from either `before` or `after` or `_`
 *        Name start from `before` or `after` or `_` is automatically in categories of except.
 */
const Before = (method: string, params: IParam = defaultParam) => {
  const { only, except } = { ...defaultParam, ...params }
  return (target: any) => {
    for (const prop of Object.getOwnPropertyNames(target.prototype)) {
      if (prop === method || prop === 'constructor' || prop.startsWith('before') || prop.startsWith('after') || prop.startsWith('_')) continue;
      if (only.length > 0 && !only.includes(prop)) continue;
      if (except.length > 0 && except.includes(prop)) continue;

      const originalMethod = target.prototype[prop];
      if (originalMethod instanceof Function) {
        target.prototype[prop] = async function (...args: any[]) {
          if (await target.prototype[method](...args)) {
            return originalMethod.apply(this, args);
          }
        };
      }
    }
  };
};

/**
 *
 * Applies on class
 * @param method should present in class or except raised
 * @param params either pass nothing or only applied method or after applied method or both if you want (rare used)
 * @returns nothing
 *
 * @NOTE If found error as `Maximum call stack size exceeded` means you are using some decorators from here, and the name of the decorator not starting with either of one('before', 'after', '_')
 *        In simple just use method naming convention starting from either `before` or `after` or `_`
 *        Name start from `before` or `after` or `_` is automatically in categories of except.
 */
const After = (method: string, params: IParam = defaultParam) => {
  const { only, except } = { ...defaultParam, ...params }
  return (target: any) => {
    for (const prop of Object.getOwnPropertyNames(target.prototype)) {
      if (prop === method || prop === 'constructor' || prop.startsWith('before') || prop.startsWith('after') || prop.startsWith('_')) continue;
      if (only.length > 0 && !only.includes(prop)) continue;
      if (except.length > 0 && except.includes(prop)) continue;

      const originalMethod = target.prototype[prop];
      if (originalMethod instanceof Function) {
        target.prototype[prop] = async function (...args: any[]) {
          await originalMethod.apply(this, args);
          return target.prototype[method](...args)
        };
      }
    }
  };
};

export { before, after, Before, After }
export default { before, after, Before, After }


/**
 *
 * See example how to use


import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Before, before } from 'App/Utils/BeforeAfterDecorators'


@Before('beforeClassCheck')
export default class TriesController {

  @before('beforeMethodCheck')
  index(ctx: HttpContextContract) {
    return ctx.response.json({ hello: 'world' })
  }

  beforeMethodCheck(ctx: HttpContextContract) {
    console.log('instanceCheck(ctx: HttpContextContract) called')
    return this._check(ctx)
  }


  beforeClassCheck(ctx: HttpContextContract) {
    console.log('classCheck(ctx: HttpContextContract) called')
    return this._check(ctx)
  }

  _check(ctx: HttpContextContract) {
    if (ctx.params.type !== '1') {
      ctx.response.json({ bye: "world" })
      return false
    }
    return true
  }
}


*/
