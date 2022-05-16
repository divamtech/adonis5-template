import { BaseCommand, args, flags } from '@adonisjs/core/build/standalone'
import { basename, join } from 'path'
import { StringTransformer } from '@adonisjs/ace/build/src/Generator/StringTransformer'
import fs from 'fs'

export default class Scaffold extends BaseCommand {
  public static commandName = 'scaffold'
  public static description = 'creates model, migration, controller and route'

  @args.string({ description: 'Name of the scaffold class' })
  public name: string

  @flags.boolean({ alias: 'wr', description: 'Without RBAC' })
  public withoutRBAC: boolean

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run(): Promise<void> {


    await this.kernel.exec('make:model:new', [this.name, '-m'])
    await this.kernel.exec('make:validator:api', [this.name])
    await this.kernel.exec('make:controller:api', [this.name, this.withoutRBAC ? '-wr' : ''])
    if (!this.withoutRBAC) {
      await this.kernel.exec('make:permission', [this.name])
    }

    const modelVariables = new StringTransformer(basename(this.name))
      .dropExtension()
      .changeForm('plural')
      .changeCase('snakecase')
      .toValue()
      .toLowerCase()
    let ctrlPrefix = new StringTransformer(basename(this.name))
      .dropExtension()
      .changeForm('plural')
      .changeCase('pascalcase')
      .toValue()
    ctrlPrefix = this.name.replace(basename(this.name), ctrlPrefix)
    const route = `\r\nRoute.resource('${modelVariables}', 'Api/${ctrlPrefix}Controller').apiOnly()\r\n`
    const routePath = join(__dirname, '..', 'start', 'routes.ts')
    await fs.promises.appendFile(routePath, route)

    this.logger.action('create').succeeded(`API based resourceful route created at start/routes.ts

        Method     │ Route                 │ Handler                             │ Name
        ────────────────────────────────────────────────────────────────────────────────────
        HEAD, GET  │ ${modelVariables}     │ Api/${ctrlPrefix}Controller.index   │ ${modelVariables}.index
        ────────────────────────────────────────────────────────────────────────────────────
        POST       │ ${modelVariables}     │ Api/${ctrlPrefix}Controller.store   │ ${modelVariables}.store
        ────────────────────────────────────────────────────────────────────────────────────
        HEAD, GET  │ ${modelVariables}/:id │ Api/${ctrlPrefix}Controller.show    │ ${modelVariables}.show
        ────────────────────────────────────────────────────────────────────────────────────
        PUT, PATCH │ ${modelVariables}/:id │ Api/${ctrlPrefix}Controller.update  │ ${modelVariables}.update
        ────────────────────────────────────────────────────────────────────────────────────
        DELETE     │ ${modelVariables}/:id │ Api/${ctrlPrefix}Controller.destroy │ ${modelVariables}.destroy
      `
    )

  }
}
