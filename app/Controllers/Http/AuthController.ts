import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

export default class AuthController {
  public async getToken({ request, response, auth }: HttpContextContract) {
    const { username, password } = await request.validate({
      schema: schema.create({
        username: schema.string(),
        password: schema.string(),
      }),
    })

    const user = await User.findByOrFail('username', username)

    if (!(await Hash.verify(user.password, password))) {
      return response.unauthorized()
    }

    const { token } = await auth.use('api').generate(user)

    return {
      ...user.serialize(),
      token,
    }
  }
}
