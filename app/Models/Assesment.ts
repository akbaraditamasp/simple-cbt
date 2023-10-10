import { DateTime } from 'luxon'
import {
  BaseModel,
  HasMany,
  ManyToMany,
  beforeCreate,
  column,
  hasMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { AttachmentContract, attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import Work from './Work'
import User from './User'

export function generateRandomHex(length) {
  const characters = '0123456789ABCDEF'
  let result = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }

  return result
}

export type QuestionForm = {
  type: 'multiple_choice' | 'essay' | 'fill'
  point: number
  choices?: string[]
  correct?: number
}

export default class Assesment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @attachment({ preComputeUrl: true })
  public question: AttachmentContract

  @column({
    prepare: (value: QuestionForm[]) => JSON.stringify(value),
    consume: (value: string) => value as unknown as QuestionForm[],
  })
  public forms: QuestionForm[]

  @column()
  public title: string

  @column()
  public code: string

  @column()
  public teacherEmail: string

  @hasMany(() => Work)
  public works: HasMany<typeof Work>

  @manyToMany(() => User)
  public participants: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateCode(assesment: Assesment) {
    let code = generateRandomHex(8)

    while (await Assesment.findBy('code', code)) {
      code = generateRandomHex(8)
    }

    assesment.code = code
  }
}
