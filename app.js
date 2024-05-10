/////// app.js
const bcrypt = require('bcryptjs');
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoDb =
  'mongodb+srv://heren1heren:Heren123.@cluster0.lo67o6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

const User = mongoose.model(
  'User',
  new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
  })
);

const app = express();
app.set('views', __dirname);
app.set('view engine', 'ejs');

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true })); // first global middleware function
app.use(passport.session()); // second global  middleware
app.use(express.urlencoded({ extended: false })); // third global middleware

const verifyCallback = async (username, password, done) => {
  console.log('called'); // so it is only called when I log in
  // hence passport.use(strategy) is only called when
  /**passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
  }) */
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false, { message: 'Incorrect username' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // passwords do not match!
      return done(null, false, { message: 'Incorrect password' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};
const strategy = new LocalStrategy(verifyCallback);
passport.use(strategy);
// does it work same way as app.use() global middleware?
passport.serializeUser((user, done) => {
  console.log('called serial');
  // I think it is only called once when passport.authenticate() get called to

  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log('called deserial');
  // I think it is always called to get user status everytime a http request come ups
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use((req, res, next) => {
  // fourth global middleware
  res.locals.currentUser = req.user;
  next();
});
app.get('/', (req, res) => {
  // route middleware that will be run after 4 global middlewares when we get request from this url
  res.render('index');
});
app.get('/sign-up', (req, res) => res.render('signup_form'));
app.post('/sign-up', async (req, res) => {
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    const result = await user.save();
    res.redirect('/');
  });
});

app.get('/log-in', (req, res) => res.render('login_form'));
// authenticate middlewares should be written at its own module and then being used to chain middlewares .
// it should not be hard-coded inside a route handler
app.post(
  '/log-in',
  passport.authenticate('local', {
    successRedirect: '/', // normally we will notice users in a way that they did it correctly
    failureRedirect: '/', //normally we will notice users in a way that they didn't do it correctly
  })
);
app.get('/log-out', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

app.listen(3000, () => console.log('app listening on port 3000!'));
