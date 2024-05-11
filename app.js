/////// app.js
import 'dotenv/config';
// need to import the whol authentication.js into app.js
import './authentication.js';
import express from 'express';
import path, { join } from 'path';
import session from 'express-session';
import passport from 'passport';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
import { User } from './mongodb.js';
const __dirname = path.dirname(__filename);
import { strategy } from './authentication.js';
import { log } from 'console';
import router from './routes/index.js';
const app = express();
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// routes
app.use('/', router);
// app.get('/', (req, res) => {
//   res.render('index');
// });
// app.get('/sign-up', (req, res) => res.render('sign-up-form'));
// app.post('/sign-up', async (req, res) => {
//   bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
//     if (err) {
//       return next(err);
//     }
//     const user = new User({
//       username: req.body.username,
//       password: hashedPassword,
//     });
//     const result = await user.save();
//     res.redirect('/');
//   });
// });

// app.get('/log-in', (req, res) => res.render('login_form'));
// // authenticate middlewares should be written at its own module and then being used to chain middlewares .
// // it should not be hard-coded inside a route handler
// app.post(
//   '/log-in',
//   passport.authenticate('local', {
//     successRedirect: '/', // normally we will notice users in a way that they did it correctly
//     failureRedirect: '/', //normally we will notice users in a way that they didn't do it correctly
//   })
// );
// app.get('/log-out', (req, res, next) => {
//   req.logout((err) => {
//     if (err) {
//       return next(err);
//     }
//     res.redirect('/');
//   });
// });

app.listen(3000, () => console.log('app listening on port 3000!'));
