const AppError = require('./../utils/appError');

const handleCastErrDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}.`;
  return new AppError(message, 400);
};
const handleDupFieldsDB = (err) => {
  const message = `the name (${err.keyValue.name}) is already in use `;
  return new AppError(message, 400);
};
const handleValidatorErr = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input date. ${errors.join('. ')} `;
  return new AppError(message, 400);
};
const handleJWTError = (err) =>
  new AppError('Invalid token, Please log in again!', 401);
const handleExpiredToken = (err) =>
  new AppError('Your session has ended!, Please log in again!', 401);
const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrProd = (err, res) => {
  console.log(err);
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR!', err);

    res.status(500).json({
      status: 'error',
      message: 'something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') err = handleCastErrDB(err);
    if (err.code === 11000) err = handleDupFieldsDB(err);
    if (err.name === 'ValidationError') err = handleValidatorErr(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError(err);
    if (err.name === 'TokenExpiredError') err = handleExpiredToken(err);
    sendErrProd(err, res);
  }
};
