const json = [
  {
    'nisn': "'0081435108",
    'nama': 'ABDUL PAHRI AL HABSI',
    'kelas': '9,3',
    'nilai': '',
    '': '',
    '__1': '',
    '__2': '',
    '__3': '',
    '__4': '',
  },
  {
    'nisn': "'0085586551",
    'nama': 'ALEA SYAQILA',
    'kelas': '9,3',
    'nilai': '',
    '': '',
    '__1': '',
    '__2': '',
    '__3': '',
    '__4': '',
  },
  {
    'nisn': "'0085949482",
    'nama': 'CALISTA DWI SYAKILA',
    'kelas': '9,3',
    'nilai': '',
    '': '',
    '__1': '',
    '__2': '',
    '__3': '',
    '__4': '',
  },
  {
    'nisn': "'3097242445",
    'nama': 'CARISSA RAMADHAN',
    'kelas': '9,3',
    'nilai': '',
    '': '',
    '__1': '',
    '__2': '',
    '__3': '',
    '__4': '',
  },
  {
    'nisn': "'0086899401",
    'nama': 'Fahri Al Hudry',
    'kelas': '9,3',
    'nilai': '',
    '': '',
    '__1': '',
    '__2': '',
    '__3': '',
    '__4': '',
  },
  {
    'nisn': "'0093053252",
    'nama': 'KHANSA AMEYLIA',
    'kelas': '9,3',
    'nilai': '',
    '': '',
    '__1': '',
    '__2': '',
    '__3': '',
    '__4': '',
  },
  {
    'nisn': "'0088507274",
    'nama': 'M. Rizki Maulana',
    'kelas': '9,3',
    'nilai': '',
    '': '',
    '__1': '',
    '__2': '',
    '__3': '',
    '__4': '',
  },
  {
    'nisn': "'0091654835",
    'nama': 'MUHAMAD FAQIH',
    'kelas': '9,3',
    'nilai': '',
    '': '',
    '__1': '',
    '__2': '',
    '__3': '',
    '__4': '',
  },
  {
    'nisn': "'0088287722",
    'nama': 'Muhammad Fardane Ar Ranniri',
    'kelas': '9,3',
    'nilai': '',
    '': '',
    '__1': '',
    '__2': '',
    '__3': '',
    '__4': '',
  },
  {
    'nisn': "'0091803775",
    'nama': 'MUHAMMAD NURUL AZIZ',
    'kelas': '9,3',
    'nilai': '',
    '': '',
    '__1': '',
    '__2': '',
    '__3': '',
    '__4': '',
  },
  {
    'nisn': "'0081922320",
    'nama': 'Muhammad Rafi Aziz',
    'kelas': '9,3',
    'nilai': '',
    '': '',
    '__1': '',
    '__2': '',
    '__3': '',
    '__4': '',
  },
  {
    'nisn': "'0087007731",
    'nama': 'MUHAMMAD RIDHO',
    'kelas': '9,3',
    'nilai': '',
    '': '',
    '__1': '',
    '__2': '',
    '__3': '',
    '__4': '',
  },
  {
    'nisn': "'0089881437",
    'nama': 'REYLITA AISYAH',
    'kelas': '9,3',
    'nilai': '',
    '': '',
    '__1': '',
    '__2': '',
    '__3': '',
    '__4': '',
  },
  {
    'nisn': "'3084585857",
    'nama': 'RIONALDO GUNAWAN',
    'kelas': '9,3',
    'nilai': '',
    '': '',
    '__1': '',
    '__2': '',
    '__3': '',
    '__4': '',
  },
  {
    'nisn': "'0083053639",
    'nama': 'RULYTA ANISA',
    'kelas': '9,3',
    'nilai': '',
    '': '',
    '__1': '',
    '__2': '',
    '__3': '',
    '__4': '',
  },
]

const fs = require('fs')

// Membaca file
fs.readFile('data.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }

  const before = JSON.parse(data)

  fs.writeFile('data.json', JSON.stringify(before.concat(json)), (err) => {
    if (err) {
      console.error(err)
      return
    }
    console.log('File berhasil ditulis.')
  })
})
