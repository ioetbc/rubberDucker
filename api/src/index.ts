import 'reflect-metadata'
import express from 'express'
import { createConnection } from 'typeorm'
import { PROD } from './constants'
import { join } from 'path'
import { userInfo } from 'os'
import { User } from './entities/User'

const main = async () => {
   await createConnection({
      database: 'rubber-ducker',
      type: 'postgres',
      port: 5432,
      logging: !PROD,
      synchronize: !PROD,
      entities: [join(__dirname, './entities/*.*')],
      username: 'ioetbc',
      password: 'therethere'
   })

   const user = await User.create({name: 'will'}).save()
   console.log('new user ', user)

   const app = express();
   app.get('/', (_req, res) => {
      res.send('fuck yeah')
   });

   app.listen(3002, () => {
      console.log('lsitening on localhost 3002')
   });
}

main();
