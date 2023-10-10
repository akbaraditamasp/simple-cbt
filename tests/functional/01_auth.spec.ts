import { test } from '@japa/runner'

test.group('01 auth', () => {
  test('Login', async ({ client }) => {
    const response = await client.get('/api/auth/sign').qs({
      username: '3084585857',
      password: '3084585857',
    })

    response.assertStatus(200)
  })
})
