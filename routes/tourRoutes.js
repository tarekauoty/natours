const express = require('express');
const { protect, restrictTo } = require('./../controllers/authController');
const toursController = require('./../controllers/toursController');
const revRouter = require('./../routes/revRoutes');

const router = express.Router();

router.use('/:tourId/reviews', revRouter);
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(toursController.getToursWithin);
router.route('/tour-stats').get(toursController.getTourStats);
router.route('/monthly-plan/:year').get(toursController.getMonthlyPlan);
router
  .route('/top-5-cheap')
  .get(toursController.aliasTopTours, toursController.getAllTours);

router
  .route('/')
  .get(toursController.getAllTours)
  .post(protect, restrictTo('admin', 'guide-lead'), toursController.createTour);

router
  .route('/:id')
  .get(toursController.getTour)
  .patch(protect, restrictTo('admin', 'guide-lead'), toursController.updateTour)
  .delete(
    protect,
    restrictTo('admin', 'guide-lead'),
    toursController.deleteTour,
  );
// router
//   .route('/:tourId/reviews')
//   .post(protect, restrictTo('user'), revController.createReview);
module.exports = router;
