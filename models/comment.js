import mongoose, { Schema } from 'mongoose';
export const Comments = mongoose.model(
  'Comments',
  new Schema({
    author: String,
    message: String,
    date: Schema.Types.Date,
  })
);
