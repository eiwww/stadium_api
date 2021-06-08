var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var fileUpload = require('express-fileupload');
var logger = require('morgan');
var cors = require('cors');

require("dotenv").config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var timetbRouter = require('./routes/timetb');
var admin = require('./routes/admin');
var stadium = require('./routes/stadium');
var reserve_cus = require('./routes/reserve_cus');
var reserve = require('./routes/reserve');
var staff = require('./routes/staff');
var customer = require('./routes/customer');
var water = require('./routes/water');
var price = require('./routes/price_stadium');
var field = require('./routes/field');
var cancel_res = require('./routes/cancel_res');
var bill = require('./routes/reserve_paid');
var water_bill = require('./routes/water_paid');
var field_bill = require('./routes/field_paid');
var admin_ac = require('./routes/login_admin');
var post = require('./routes/post');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());

app.use(express.static('public'));
app.use(express.static('upload'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/timetb', timetbRouter);
app.use('/admin', admin);
app.use('/stadium', stadium);
app.use('/reserve_cus', reserve_cus);
app.use('/reserve', reserve);
app.use('/staff', staff);
app.use('/customer', customer);
app.use('/water', water);
app.use('/price', price);
app.use('/field',field);
app.use('/cancel_res', cancel_res);
app.use('/bill', bill);
app.use('/water_bill', water_bill);
app.use('/field_bill', field_bill);
app.use('/admin_ac', admin_ac);
app.use('/post', post);


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
