import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Assesment from './Assesment'
import User from './User'

export type SheetType = {
  answer: string
  point: number
}

export default class Work extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public assesmentId: number

  @column()
  public userId: number

  @column({
    prepare: (value: SheetType[]) => JSON.stringify(value),
    consume: (value: string) => value as unknown as SheetType[],
  })
  public sheet: SheetType[]

  @column()
  public point: number

  @belongsTo(() => Assesment)
  public assesment: BelongsTo<typeof Assesment>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
