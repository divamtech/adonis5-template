import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 80).notNullable()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('country_code', 5).defaultTo('+91')
      table.string('mobile_number', 13)
      table.string('image_url', 510).nullable()
      table.boolean('is_email_verify').defaultTo(false)

      table.timestamps()

      //INDEXING & UNIQUE
      table.unique(['country_code', 'mobile_number'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
