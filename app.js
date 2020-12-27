require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const session = require('express-session')
const MemoryStore = require('memorystore')(session)

const indexRouter = require('./main/src/routes/indexRouter');
const webcamRouter = require('./main/src/routes/webcamRouter');
const spotifyRouter = require('./main/src/routes/spotifyRouter');
const tracksRouter = require('./main/src/routes/trackRouter');
const infoRouter = require('./main/src/routes/infoRouter')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json({limit: '100mb'}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// express-session
const sess = session({
    store: new MemoryStore({
        ttl: 45 * 60 * 1000, // 45 minutes
        checkPeriod: 30 * 60 * 1000, // half an hour
    }),
    secret: process.env.EXPRESS_SESSION_SECRET, // https://github.com/expressjs/session#secret
    resave: false,
    saveUninitialized: false,
    rolling: false,
});

// https://github.com/expressjs/session#cookiesecure
if (process.env.ENVIRONMENT === "production") {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}
app.use(sess)

app.use('/', indexRouter);
app.use('/webcam', webcamRouter);
app.use('/spotify', spotifyRouter);
app.use('/tracks', tracksRouter);
app.use('/info', infoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
