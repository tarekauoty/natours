const Review = require('./../models/reviewModel');
// const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setTourUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.getRev = factory.getOne(Review);
exports.updateRev = factory.updateOne(Review);
exports.deleteRev = factory.deleteOne(Review);
