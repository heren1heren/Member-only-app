import LocalStrategy from 'passport-local/lib/strategy.js';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { User } from './mongodb.js';
const verifyCallback = async (username, password, done) => {
  try {
    // I want to search through User and Admin models both at the same time but can not figure out so I do these
    const user = await User.findOne({ username: username });

    if (!user) {
      return done(null, false, { message: 'Incorrect username' });
      // where this return statement is returned to? I don't understand what does done() do too.

      // how to extract message from done to display error to user?
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // passwords do not match!

      return done(null, false, { message: 'Incorrect password' });
      // test it
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};
export const strategy = new LocalStrategy(verifyCallback);
passport.use(strategy);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// implement google authentication if can do it
