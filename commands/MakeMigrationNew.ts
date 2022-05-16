import MakeMigration from '@adonisjs/lucid/build/commands/MakeMigration'
import { string } from '@poppinss/utils/build/helpers'
import { join } from 'path'

export default class MakeMigrationNew extends MakeMigration {
  public static commandName = 'make:migration:new'
  public static description = 'Make a new migration file for MySQL'

  private async getDirectoryOverride(migrationPaths?: string[]): Promise<string> {
    if (this.folder) {
      return this.folder
    }

    let directories =
      migrationPaths && migrationPaths.length ? migrationPaths : ['database/migrations']
    if (directories.length === 1) {
      return directories[0]
    }

    return this.prompt.choice('Select the migrations folder', directories, { name: 'folder' })
  }

  public async run(): Promise<void> {
    if (this.table) {
      return super.run()
    }

    const db = this.application.container.use('Adonis/Lucid/Database')
    const connection = db.getRawConnection(this.connection || db.primaryConnectionName)

    /**
     * Ensure the define connection name does exists in the
     * config file
     */
    if (!connection) {
      this.logger.error(
        `${this.connection} is not a valid connection name. Double check config/database file`
      )
      return
    }

    /**
     * Not allowed together, hence we must notify the user about the same
     */
    if (this.table && this.create) {
      this.logger.warning('--table and --create cannot be used together. Ignoring --create')
    }

    /**
     * The folder for creating the schema file
     */
    const folder = await this.getDirectoryOverride((connection.config.migrations || {}).paths)

    /**
     * Using the user defined table name or an empty string. We can attempt to
     * build the table name from the migration file name, but let's do that
     * later.
     */
    const tableName = this.table || this.create || ''

    /**
     * Template stub
     */
    const stub = join(
      __dirname,
      '..',
      'templates',
      'migration-make.txt'
    )

    /**
     * Prepend timestamp to keep schema files in the order they
     * have been created
     */
    const prefix = `${new Date().getTime()}_`

    this.generator
      .addFile(this.name, { pattern: 'snakecase', form: 'plural', prefix })
      .stub(stub)
      .destinationDir(folder)
      .appRoot(this.application.cliCwd || this.application.appRoot)
      .useMustache()
      .apply({
        toClassName() {
          return function (filename: string, render: (text: string) => string) {
            const migrationClassName = string.camelCase(
              tableName || render(filename).replace(prefix, '')
            )
            return `${migrationClassName.charAt(0).toUpperCase()}${migrationClassName.slice(1)}`
          }
        },
        toTableName() {
          return function (filename: string, render: (text: string) => string) {
            return tableName || string.snakeCase(render(filename).replace(prefix, ''))
          }
        },
      })

    await this.generator.run()
  }
}
