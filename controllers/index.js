import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { Comments } from '../models/comment.js';
export const index = asyncHandler(async (req, res) => {
  const comments = await Comments.find().exec();
  res.render('index', { errors: undefined, comments });
});

export const indexPost = [
  [
    body('authorinput').trim().isLength({ min: 5 }),
    body('contentinput').trim().isLength({ min: 10 }.escape),
  ],

  asyncHandler((req, res, next) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      res.render('index', { errors });
      return;
    }
    const comment = new Comments({
      author: req.body.authorinput,
      message: req.body.contentinput,
      date: new Date(),
    });
    comment.save();
    res.redirect('/');
  }),
];
