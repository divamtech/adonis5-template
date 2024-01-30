import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from './BaseController'
import AuthValidator from 'App/Validators/Api/AuthValidator'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

export default class RegistrationController extends BaseController {
  public async signup(ctx: HttpContextContract) {
    const filterData = await ctx.request.validate(AuthValidator.Signup)
    const data = User.filterData(filterData)
    data.password = filterData.password
    const user = await User.create(data)
    const token = await ctx.auth.use('api').attempt(filterData.email, filterData.password)
    return ctx.response.status(201).json({ ...user.serialize(), token })
  }

  public async login(ctx: HttpContextContract) {
    const { email, password } = ctx.request.only(['email', 'password'])

    try {
      const token = await ctx.auth.use('api').attempt(email, password)
      if (!ctx.auth.use('api').user) {
        return ctx.response.status(400).json({ message: 'Invalid credentials', token })
      }
      return ctx.response.json({ ...ctx.auth.use('api').user!.serialize(), token })
    } catch (e) {
      return ctx.response.status(400).json({ message: 'Invalid credentials' })
    }
  }

  public async show(ctx: HttpContextContract) {
    return ctx.response.json(this.getUser(ctx))
  }

  public async update(ctx: HttpContextContract) {
    const validatorData = await ctx.request.validate(AuthValidator.Update)
    try {
      if (validatorData.old_password) {
        if (ctx.auth.user!.password && !(await Hash.verify(ctx.auth.user!.password, validatorData.old_password))) {
          return ctx.response.status(400).json({ message: `old password doesn't match` })
        }
      } else if (validatorData.password && !validatorData.old_password) {
        return ctx.response.status(400).json({ message: 'Please send old password for confirmation' })
      }
      const data = ctx.request.only(Object.keys(User.$keys.serializedToAttributes.all()))
      ctx.auth.user!.merge(data)
      await ctx.auth.user!.save()
      return ctx.response.json(this.getUser(ctx))
    } catch (e) {
      console.log('error: ', e)
      return ctx.response.status(400).json({ message: 'something went wrong', errors: [e] })
    }
  }

  public async logout(ctx: HttpContextContract) {
    await ctx.auth.use('api').logout()
    return ctx.response.json({ message: 'user has been logged out.' })
  }

  private getUser(ctx) {
    const auth = ctx.request.header('authorization')
    const [type, token] = auth?.split(' ')
    return { ...ctx.auth.user?.serialize(), token: { type: type.toLowerCase(), token } }
  }
}
