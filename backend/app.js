var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
var usersRouter = require('./routes/userRoutes');
var preferenceRoutes = require('./routes/preferenceRoutes');
var rewardRoutes = require('./routes/rewardRoutes');
var taskRoutes = require('./routes/taskRoutes');
var userRewardRoutes = require('./routes/userRewardRoutes');
var notifsRoutes = require('./routes/notifsRoutes');

dotenv.config();
connectDB();
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors({
  origin: true,             
  credentials: true        
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', usersRouter);
app.use('/tasks', taskRoutes);
app.use('/rewards', rewardRoutes);
app.use('/userRewards', userRewardRoutes);
app.use('/preferences', preferenceRoutes);
app.use('/notifs', notifsRoutes);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
