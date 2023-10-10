import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import fs from 'fs'
import Application from '@ioc:Adonis/Core/Application'

type Student = {
  nisn: string
  nama: string
  kelas: string
}

const getStudent = () =>
  new Promise((resolve) => {
    fs.readFile(Application.makePath('./data.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }

      resolve(JSON.parse(data))
    })
  })

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await User.createMany(
      await getStudent().then((data) =>
        (data as []).map((item) => ({
          username: (item as Student).nisn.replace("'", ''),
          fullname: (item as Student).nama,
          password: (item as Student).nisn.replace("'", ''),
          room: (item as Student).kelas,
        }))
      )
    )
  }
}
