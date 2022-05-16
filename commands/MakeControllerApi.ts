import { flags } from '@adonisjs/core/build/standalone'
import Controller from '@adonisjs/assembler/build/commands/Make/Controller'
import { basename, join } from 'path'
import { StringTransformer } from '@adonisjs/ace/build/src/Generator/StringTransformer'
import ChangeCase from 'App/Utils/ChangeCase'

export default class MakeControllerApi extends Controller {
  public static commandName = 'make:controller:api'
  public static description = 'Make a new HTTP controller for API only'

  @flags.boolean({ alias: 'wr', description: 'Without RBAC' })
  public withoutRBAC: boolean

  protected templateData(): any {
    const modelName = new StringTransformer(basename(this.name))
      .dropExtension()
      .changeForm('singular')
      .changeCase('pascalcase')
      .toValue()
    const modelVariable = ChangeCase.variableCase(modelName)
    const ctrlPrefix = new StringTransformer(basename(this.name))
      .dropExtension()
      .changeForm('plural')
      .changeCase('pascalcase')
      .toValue()
    const modelVariables = ChangeCase.variableCase(ctrlPrefix)
    return { modelName, modelVariable, modelVariables }
  }

  protected getStub(): string {
    return join(__dirname, '..', 'templates', this.withoutRBAC ? 'controller.txt' : 'controller-permission.txt')
  }

  protected getDestinationPath(): string {
    return 'app/Controllers/Http/Api'
  }
}
