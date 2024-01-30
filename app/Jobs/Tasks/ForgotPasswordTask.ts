import { JobContract } from '@ioc:Rocketseat/Bull'
import Env from '@ioc:Adonis/Core/Env'
import Mail from '@ioc:Adonis/Addons/Mail'

import UrlService from '@ioc:UrlService'
import JWTService from 'App/Services/JWTService'

export default class ForgotPassword implements JobContract {
  public key = this.constructor.name

  public async handle(job) {
    const data = job.data.payload;
    const jwt = JWTService.createJWT({ user_id: data.id, email: data.email }, '7d')
    const url = UrlService.baseURL.join('reset_password', jwt)
    await Mail.send((message) => {
      message
        .to(data.email)
        .from(Env.get('COMPANY_EMAIL'))
        .subject('WebLedger: Reset Password')
        .htmlView('emails/forgotPassword', { data, url })
    })
    return data
  }
}
