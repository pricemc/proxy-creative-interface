var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/proxy')
  .catch((err) => console.error(err));

var db = mongoose.connection;
var indexRouter = require('./routes/index')(db);

var app = express();


var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var proxy = require('redbird')({ port: 80 });
var Domain = require("./models/Domain")(proxy);
var path = require('path');
var appDir = path.dirname(require.main.filename);
var git_rev;
var appRootFolder = function (dir, level) {
  var arr = dir.split('\\');
  arr.splice(arr.length - level, level);
  var rootFolder = arr.join('\\');
  return rootFolder;
}


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ status: err.status, message: err.message });
});

// db.once('open', function () {
//   console.log("Connected to DB.");
//   console.log("Proxy Running.");

//   Domain.find(function (err, proxies) {
//     if (err) return console.error(err);
//     proxies.forEach(async element => {
//       console.log(element.subdomain + " registered.");
//       if (!element.deleted) element.register();
//     });
//   })

// });

// require('child_process').exec('git rev-parse --short HEAD', { cwd: appRootFolder(__dirname, 1) }, function (err, stdout) {
//   git_rev = stdout;
//   console.log('Last commit hash on this branch is: ', stdout);
// });




module.exports = app;
