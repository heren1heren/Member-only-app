import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { body, validationResult } from 'express-validator';
export const logInGet = asyncHandler((req, res) =>
  res.render('login-form', { errors: undefined })
);
export const logInFailureGet = asyncHandler((req, res, next) => {
  res.send(
    "your password is wrong or your username is incorrect <a href='/log-in'> log in again </a>"
  );
});
export const logOutGet = asyncHandler((req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});
export const logInPost = [
  [
    body('username').trim().isLength({ min: 8 }).escape(),
    body('password').trim().isLength({ min: 8 }).escape(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      res.render('login-form', { errors: errors });
      return;
    }
    next();
  },
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in-failure',
  }),
];
