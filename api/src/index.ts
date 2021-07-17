import 'reflect-metadata'
require('dotenv-safe').config()
import express from 'express'
import { createConnection } from 'typeorm'
import { PROD } from './constants'
import { join } from 'path'
import { User } from './entities/User'
import { Strategy as GitHubStrategy } from 'passport-github'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const main = async () => {
   await createConnection({
      database: 'rubber-ducker',
      type: 'postgres',
      port: 5432,
      logging: !PROD,
      synchronize: !PROD,
      entities: [join(__dirname, './entities/*.*')],
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
   })

   const app = express();

   passport.serializeUser((user: any, done) => {
      done(null, user.accessToken);
    });

   app.use(passport.initialize());

   // stratergy config
   passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "http://localhost:3002/auth/github/callback"
    }, async (_, __, profile, cb) => {
         let user = await User.findOne({ where: { githubId: profile.id! }})
         if (!user) {
            user = await User.create({ name: profile.username!, githubId: profile.id! }).save()
         }
         cb(null, { accessToken: jwt.sign({ userId: user.id }, process.env.JWT_SIGNATURE!, { expiresIn: '1y' }) })
      }
   ));

   // to load the login screen
   app.get('/auth/github', passport.authenticate('github', { session: false }))

   // once login is successful see callbackURL
   app.get('/auth/github/callback', passport.authenticate('github', { session: false }),
   (req: any, res) => {
      res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`)
   })

   app.get('/', (_req, res) => {
      res.send('fuck yeah')
   })

   app.listen(3002, () => {
      console.log('lsitening on localhost 3002')
   });
}

main();
