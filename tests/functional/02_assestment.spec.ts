import { test } from '@japa/runner'
import Drive from '@ioc:Adonis/Core/Drive'
import { file } from '@ioc:Adonis/Core/Helpers'
import User from 'App/Models/User'
import Assesment from 'App/Models/Assesment'
import { SheetType } from 'App/Models/Work'

test.group('02 assestment', () => {
  test('Store assesment', async ({ client, assert }) => {
    const fakeDrive = Drive.fake()
    const fakePdf = await file.generatePdf('2mb')

    const response = await client
      .post('/api/assesment')
      .file('question', fakePdf.contents, { filename: fakePdf.name })
      .fields({
        'forms[0][type]': 'multiple_choice',
        'forms[0][point]': 1,
        'forms[0][choices][0]': 'A',
        'forms[0][choices][1]': 'B',
        'forms[0][choices][2]': 'C',
        'forms[0][choices][3]': 'D',
        'forms[0][correct]': 1,
        'title': 'PKN Kelas 8',
        'teacher_email': 'solahudin@gmail.com',
        'rooms[0]': '7,1',
        'rooms[1]': '7,2',
        'rooms[2]': '7,3',
        'rooms[3]': '8,1',
        'rooms[4]': '8,2',
        'rooms[5]': '8,3',
        'rooms[6]': '8,4',
        'rooms[7]': '9,1',
        'rooms[8]': '9,2',
        'rooms[9]': '9,3',
      })

    response.assertStatus(200)

    assert.isTrue(await fakeDrive.exists(fakePdf.name))

    Drive.restore()
  })

  test('Get by code', async ({ client, assert }) => {
    const user = await User.first()
    const assesment = await Assesment.first()

    assert.isTrue(Boolean(user))
    assert.isTrue(Boolean(assesment))

    const response = await client.get('/api/assesment/code/' + assesment!.code).loginAs(user!)

    response.assertStatus(200)
  })

  test('Store work', async ({ client, assert }) => {
    const user = await User.first()
    const assesment = await Assesment.first()

    assert.isTrue(Boolean(user))
    assert.isTrue(Boolean(assesment))

    const response = await client
      .post(`/api/assesment/${assesment?.id}/work`)
      .form({
        sheet: [
          {
            answer: 'B',
          },
        ] as SheetType[],
      })
      .loginAs(user!)

    response.assertStatus(200)
  })

  test('Assesment index', async ({ client }) => {
    const response = await client.get('/api/assesment')

    response.assertStatus(200)
  })

  test('Assesment show', async ({ client, assert }) => {
    const assesment = await Assesment.first()
    assert.isTrue(Boolean(assesment))

    const response = await client.get('/api/assesment')

    response.assertStatus(200)
  })
})
