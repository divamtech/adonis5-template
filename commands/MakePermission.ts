import { args } from '@adonisjs/core/build/standalone'
import { basename, join } from 'path'
import { StringTransformer } from '@adonisjs/ace/build/src/Generator/StringTransformer'
import { BaseGenerator } from '@adonisjs/assembler/build/commands/Make/Base'
import ChangeCase from '../app/Utils/ChangeCase'

export default class MakePermission extends BaseGenerator {
  /**
   * Required by BaseGenerator
   */
  protected suffix = 'Permissions'
  protected form = 'singular' as const
  protected pattern = 'pascalcase' as const
  protected resourceName: string
  protected createExact: boolean

  public static commandName = 'make:permission'
  public static description = 'create permission class, pass the name of object into singular form'

  @args.string({ description: 'Name of the permission class' })
  public name: string

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

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
    return join(__dirname, '..', 'templates', 'permissions.txt')
  }

  protected getDestinationPath(): string {
    return 'RBAC/Permissions'
  }

  public async run() {
    this.resourceName = this.name
    await super.generate()
  }
}
