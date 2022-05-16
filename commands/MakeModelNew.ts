import MakeModel from '@adonisjs/lucid/build/commands/MakeModel'
import { join } from 'path'

export default class MakeModelNew extends MakeModel {
  public static commandName = 'make:model:new'
  public static description = 'Make a new Lucid model for MySQL'

  public async run(): Promise<void> {
    const stub = join(__dirname, '..', 'templates', 'model.txt')

    const path = this.application.resolveNamespaceDirectory('models')

    this.generator
      .addFile(this.name, { pattern: 'pascalcase', form: 'singular' })
      .stub(stub)
      .destinationDir(path || 'app/Models')
      .useMustache()
      .appRoot(this.application.cliCwd || this.application.appRoot)

    if (this.migration) {
      await this.kernel.exec('make:migration:new', [this.name])
    }

    await this.generator.run()
  }
}
