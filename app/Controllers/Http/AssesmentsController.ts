import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import Assesment, { QuestionForm } from 'App/Models/Assesment'
import User from 'App/Models/User'
import Work, { SheetType } from 'App/Models/Work'

export default class AssesmentsController {
  public async store({ request }: HttpContextContract) {
    const {
      question,
      forms,
      title,
      teacher_email: teacherEmail,
      rooms,
    } = await request.validate({
      schema: schema.create({
        question: schema.file({
          extnames: ['pdf'],
          size: '2mb',
        }),
        forms: schema.array().members(
          schema.object().members({
            type: schema.enum(['multiple_choice', 'essay', 'fill']),
            point: schema.number(),
            choices: schema.array
              .nullableAndOptional([rules.requiredWhen('type', '=', 'multiple_choice')])
              .members(schema.string()),
            correct: schema.number.nullableAndOptional([
              rules.requiredWhen('type', '=', 'multiple_choice'),
            ]),
          })
        ),
        title: schema.string(),
        teacher_email: schema.string({}, [rules.email()]),
        rooms: schema.array().members(schema.string()),
      }),
    })

    return await Database.transaction(async (trx) => {
      const assesment = await Assesment.create(
        {
          question: Attachment.fromFile(question),
          forms: forms as QuestionForm[],
          title,
          teacherEmail: teacherEmail,
        },
        {
          client: trx,
        }
      )

      let participants: User[] = []
      for (const room of rooms) {
        const getParticipants = await User.query().where('room', room)
        participants = participants.concat(getParticipants)
      }

      const users = await User.query().whereIn(
        'username',
        participants.map((participant) => participant.username)
      )

      await assesment
        .useTransaction(trx)
        .related('participants')
        .sync(users.map((user) => user.id))

      return assesment.serialize()
    })
  }

  public async getByCode({ params, auth }: HttpContextContract) {
    const assesment = await auth
      .use('api')
      .user!.related('assesments')
      .query()
      .where('code', params.code)
      .firstOrFail()

    return assesment.serialize()
  }

  public async storeSheet({ request, auth, params }: HttpContextContract) {
    const assesment = await auth
      .use('api')
      .user!.related('assesments')
      .query()
      .where('assesments.id', params.id)
      .firstOrFail()

    const { sheet } = await request.validate({
      schema: schema.create({
        sheet: schema.array().members(
          schema.object().members({
            answer: schema.string(),
          })
        ),
      }),
    })

    return await Database.transaction(async (trx) => {
      let totalPoint = 0
      let userPoint = 0
      const correctionSheet: SheetType[] = []

      let i = 0
      for (const form of assesment.forms) {
        totalPoint = totalPoint + form.point

        if (sheet[i]) {
          const tempSheet = sheet[i] as SheetType
          if (form.type === 'multiple_choice') {
            tempSheet.point = tempSheet.answer === form.choices![form.correct!] ? form.point : 0
          }

          userPoint = userPoint + (tempSheet.point || 0)

          correctionSheet.push(tempSheet)
        }

        i = i + 1
      }

      const work = await Work.updateOrCreate(
        {
          assesmentId: assesment.id,
          userId: auth.use('api').user!.id,
        },
        {
          sheet: correctionSheet,
          point: Math.round((userPoint / totalPoint) * 100),
        },
        {
          client: trx,
        }
      )

      return work.serialize()
    })
  }

  public async index({ request }: HttpContextContract) {
    const { page = 1 } = await request.validate({
      schema: schema.create({
        page: schema.number.optional(),
      }),
    })

    const limit = 20
    const offset = (page - 1) * limit

    const assesmentsQuery = Assesment.query()

    const assesmentsCount = await assesmentsQuery.clone().count('* as total')

    const assesments = await assesmentsQuery
      .clone()
      .withCount('participants')
      .offset(offset)
      .limit(limit)

    return {
      page_count: Math.ceil(Number(assesmentsCount[0].$extras.total) / limit),
      rows: assesments.map((assesment) => ({
        ...assesment.serialize(),
        participants_count: Number(assesment.$extras.participants_count),
      })),
    }
  }

  public async show({ params }: HttpContextContract) {
    const assesment = await Assesment.query()
      .where('assesments.id', params.id)
      .preload('works', (query) => {
        query.preload('user')
      })
      .firstOrFail()

    return assesment.serialize()
  }
}
