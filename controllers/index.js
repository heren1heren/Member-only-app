import asyncHandler from 'express-async-handler';

import { body, validationResult } from 'express-validator';
import { Comments } from '../models/comment.js';
export const index = asyncHandler(async (req, res) => {
  const comments = await Comments.find().exec();

  console.log(res.locals);
  const user = res.locals.currentUser;
  if (user) {
    res.render('index', { errors: undefined, comments, isAdmin: true });
    return;
  }
  res.render('index', { errors: undefined, comments, isAdmin: false });
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
export const commentDeletePost = asyncHandler(async (req, res, next) => {
  // get comment id when we create the comment
  console.log(req.body);
  res.redirect('/');
});
