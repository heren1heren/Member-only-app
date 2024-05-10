import { Router } from 'express';
import passport from 'passport';
import { User } from '../mongodb.js';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
const router = Router();

//* GET HTTP HANDLERS

router.get('/', (req, res) => {
  res.render('index');
});
router.get('/sign-up', (req, res) => res.render('sign-up-form'));

router.get('/log-in', (req, res) => res.render('login-form'));
// authenticate middlewares should be written at its own module and then being used to chain middlewares .
// it should not be hard-coded inside a route handler
router.get('/log-in-failure', (req, res, next) => {
  res.send(
    "your password is wrong or your username is incorrect <a href='/log-in'> log in again </a>"
  );
});

router.get('/log-out', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});
router.get('/post-comment', async (req, res, next) => {
  res.send('');
});

//* POST HTTPS HANDLERS
router.post(
  '/sign-up',
  [
    // valitidate first
    body('username')
      .trim()
      .isLength({ min: 8 })
      .withMessage('username is too short')
      .escape(),
    body('password').trim().isLength({ min: 8 }).escape(),
  ],
  async (req, res) => {
    // get errors from previous middle ware valitator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      // render the page again
      // so rendering the page again and displaying errors message is a job of validating process and  not authenticating  process?
      // can we do like this with authenticating process too?
      // with errors message
      res.render('sign-up-form', errors);
      return;
    }

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
      });
      // check if user is already existed or not
      const result = await user.save();
      res.redirect('/log-in');
    });
  }
);
router.post(
  '/log-in',
  // validate inputs first
  (req, res, next) => {
    console.log(req.body);
    next();
  },
  [body()],

  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in-failure',
  })
);
router.post(
  '/',
  [
    body('username').trim().isLength({ min: 8 }).escape(),
    body('password').trim().isLength({ min: 8 }).escape(),
  ],

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      res.render('login-form', errors);
      return;
    }
    res.redirect('/');
  }
);

export default router;
