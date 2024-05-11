import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';

export const signUpGet = asyncHandler((req, res) =>
  res.render('sign-up-form', { errors: undefined })
);
export const signUpPost = [
  // validating
  [
    body('username')
      .trim()
      .isLength({ min: 8 })
      .withMessage('name must be longer than 8')
      .escape(),

    body('password')
      .trim()
      .isLength({ min: 8 })
      .withMessage('password must be longer than 8 characters')
      .escape(),
  ],
  //processing
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      res.render('sign-up-form', {
        errors,
      });
      return;
    }
    res.redirect('/log-in');
  }),
];
