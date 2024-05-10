import mongoose from 'mongoose';
import 'dotenv/config';
const Schema = mongoose.Schema;
const mongoDb = process.env.mongoKey;
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

export const User = mongoose.model(
  'User',
  new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
  })
);
