import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'assesments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.json('question').notNullable()
      table.json('forms').notNullable()
      table.string('title').notNullable()
      table.string('code').notNullable().unique()
      table.string('teacher_email').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
