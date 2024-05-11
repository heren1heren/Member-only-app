import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { User } from '../mongodb.js';
export const signUpGet = asyncHandler((req, res) =>
  res.render('sign-up-form', { errors: undefined })
);
export const signUpPost = [
  // validating then use hash password
  [
    body('username')
      .trim()
      .isLength({ min: 1 })
      .withMessage('name must not be empty')
      .escape(),

    body('password')
      .trim()
      .isLength({ min: 8 })
      .withMessage('password must be longer than 8 characters')
      .escape(),
  ],
  //processing
  asyncHandler(async (req, res, next) => {
    // get errors from request fields
    const errors = validationResult(req);
    const existedUser = await User.findOne({ username: req.body.username });

    if (existedUser) {
      // push new error inside errors array
      errors.errors.push({
        name: 'existed User',
        msg: ' username is already existed',
      });
    }
    if (!errors.isEmpty()) {
      // handling error
      console.log(errors);
      res.render('sign-up-form', {
        errors: errors.errors,
      });
      return;
    }
    // if success
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      // if err, do something
      if (err) {
        console.log(err);
        return;
      }
      if (req.body.isadmin) {
        const user = User.create({
          username: req.body.username,
          password: hashedPassword,
          isAdmin: true,
        });
        console.log(user);
      } else {
        const user = User.create({
          username: req.body.username,
          password: hashedPassword,
          isAdmin: false,
        });
      }
    });

    res.redirect('/log-in');
  }),
];
