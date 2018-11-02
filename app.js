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
var indexRouter = require('./routes/index');

var app = express();
var proxy;
var domain = "the-allo.me";

var path = require('path');
var appDir = path.dirname(require.main.filename);
var git_rev;
var git_time;
var appRootFolder = function (dir, level) {
  var arr = dir.split('\\');
  arr.splice(arr.length - level, level);
  var rootFolder = arr.join('\\');
  return rootFolder;
}


var Domain;


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
app.use('/', indexRouter);
app.get('/build', function(req, res) {
  res.json({build: git_rev,time: git_time});
})

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

db.once('open', function () {
  Domain = require("./models/Domain");

  console.log("Connected to DB.");
  proxy = require('redbird')({ port: 80 });
  console.log("Proxy Running.");
  Domain.find({ subdomain: 'proxy', port: 3000 }, function (err, domains) {
    if (domains.length == 0) {
      new Domain({
        subdomain: 'proxy',
        port: 3000,
        deleted: false,
        deletable: false,
        registered: false
      }).save(function (err, domain) {
        if (err)
          console.error(err);
        else
          console.log(domain);
      })
    }
  });
  registerDomains(ignore = true);
  setInterval(() => registerDomains(), 5000);
});

require('child_process').exec('git rev-parse --short HEAD', function (err, stdout) {
  git_rev = stdout;
  console.log('Last commit hash on this branch is: ', stdout);
});
require('child_process').exec('git log -1 --format=%cd --date=local', function (err, stdout) {
  git_time = stdout;
  console.log('Last commit on this branch was: ', stdout);
});

function registerDomains(ignore = false) {
  Domain.find(function (err, domains) {
    if (err) return console.error(err);
    domains.forEach(async element => {
      if (!element.deleted && (ignore || !element.registered)) {
        proxy.register(element.subdomain + "." + domain, "http://localhost:" + element.port);
        element.registered = true;
        element.save();
        console.log(element.subdomain + " registered.");
      }
      else if (element.deleted) {
        console.log(element.subdomain + " deleted.");
        if (element.registered) proxy.unregister(element.subdomain + "." + domain);
        element.remove();
      }
    });
  })
}


module.exports = app;
