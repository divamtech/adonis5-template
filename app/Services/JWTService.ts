import Env from '@ioc:Adonis/Core/Env'
import { sign as JWTSign, verify as JWTVerify } from 'jsonwebtoken'

export default class JWTService {
  static createJWT(values: object, expiresIn: string): string {
    return JWTSign(values, Env.get('JWT_SECRET'), { expiresIn })
  }

  static verifyToken(token: string): any {
    return JWTVerify(token, Env.get('JWT_SECRET'))
  }
}
