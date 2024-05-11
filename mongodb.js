import mongoose, { Schema } from 'mongoose';
import 'dotenv/config';

const mongoDb = process.env.mongoKey;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDb);
}
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

export const User = mongoose.model(
  'User',
  new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: Boolean,
  })
);
// we can create a model admin or giving User a field named isAdmin
