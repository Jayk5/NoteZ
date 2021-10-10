require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
// const MongoDBStore = require('connect-mongo').default;
let dburl = process.env.DB_URL || 'mongodb://localhost:27017/AppDB';

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

mongoose.connect(dburl, {
    useNewURLParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database Connected");
});

// dburl = 'mongodb://localhost:27017/AppDB';

// const store1 = new MongoDBStore({
//     url: dburl,
//     secret: 'sikret',
//     touchAfter: 24 * 60 * 60
// });

// store.on('error', function (e) {
//     console.log('Session Store error', e)
// })

const sessionCfg = {
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionCfg));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    // console.log(req.session);
    if (!['/login', '/register', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


const notices = require('./routes/notices');
app.use('/notices', notices);
const comments = require('./routes/comments');
app.use('/notices/:id/comments', comments);
const userRoutes = require('./routes/users');
const MongoStore = require('connect-mongo');
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.render('notices/home');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    if (!err.message) err.message = 'Something went wrong';
    // res.status(statusCode).render('error', { err });
    // gives entire stack trace of error - can be useful
    res.status(statusCode);
    req.flash('error', err.message);
    res.redirect('/notices');
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`ON PORT ${port}`);
});