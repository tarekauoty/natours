const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const xss = require('xss-clean');

const appError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const revRouter = require('./routes/revRoutes');

const app = express();
//Global middleware

// security http
app.use(helmet());

// Body parser, reading data from body into req.body
app.use(express.json());

app.use(mongoSanitize());
app.use(xss());

app.use(
  hpp({
    whitelist: [
      'duration',
      'maxGroupSize',
      'ratingsQuantity',
      'ratingsAverage',
      'price',
      'difficulty ',
    ],
  }),
);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// limit req from ip
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests, Please try again in an hour!',
});

app.use('/api', limiter);
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', revRouter);

app.all('*', (req, res, next) => {
  next(new appError(`cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
