import 'reflect-metadata'
require('dotenv-safe').config()
import express from 'express'
import { createConnection } from 'typeorm'
import { PROD } from './constants'
import { join } from 'path'
import { User } from './entities/User'
import { Todo } from './entities/Todo'
import { Strategy as GitHubStrategy } from 'passport-github'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import { isAuth } from './isAuth'

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
   app.use(cors({ origin: 'vscode-webview://webviewview-rubber-ducker-sidebar' }))
   passport.serializeUser((user: any, done) => {
      done(null, user.accessToken);
    });

   app.use(passport.initialize());
   app.use(express.json())

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

   app.get('/todo', isAuth, async(req: any, res) => {
      const todos = await Todo.find({ where: { creatorId: req.userId }, order: { id: 'DESC' } })
      res.send({ todos })
   })

   app.post('/todo', isAuth, async (req: any, res) => {
      const todo = await Todo.create({ text: req.body.text, creatorId: req.userId } as Todo).save()
      res.send({ todo })
   })

   app.put('/todo', isAuth, async (req: any, res) => {
      const todo = await Todo.findOne(req.body.id)
      if (!todo) {
         res.send({ todo: null })
         return
      }
      if (todo.creatorId !== req.userId) {
         throw new Error('Not authorized')
      }
      todo.completed = !todo.completed
      await todo.save()
      res.send({ todo })
   })

   // returns the current user logged in based of the JWT token passed from the extension
   app.get('/me', async (req, res) => {
      const authHeader = req.headers.authorization
      if (!authHeader) {
         res.send({ user: null })
         return
      }

      const token = authHeader.split(' ')[1]
      if (!token) {
         res.send({ user: null })
         return
      }

      let userId
      try {
         const payload: any = jwt.verify(token, process.env.JWT_SIGNATURE!)
         userId = payload.userId
      } catch (error) {
         res.send({ user: null })
         return
      }
      if (!userId) {
         res.send({ user: null })
         return
      }
      const user = await User.findOne(userId)
      res.send({ user })
   })

   app.get('/', (_req, res) => {
      res.send('fuck yeah')
   })

   app.listen(3002, () => {
      console.log('lsitening on localhost 3002')
   });
}

main();
