import Validator from '@adonisjs/assembler/build/commands/Make/Validator'
import { join } from 'path'

export default class MakeValidatorApi extends Validator {
  public static commandName = 'make:validator:api'
  public static description = 'validator for API only'

  protected getDestinationPath(): string {
    return 'app/Validators/Api'
  }

  protected getStub(): string {
    return join(__dirname, '..', 'templates', 'validator.txt')
  }
}
