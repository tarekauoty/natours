const express = require('express');
const { protect, restrictTo } = require('./../controllers/authController');
const authController = require('./../controllers/authController');

const revController = require('./../controllers/revController');

const router = express.Router({ mergeParams: true });
router.use(authController.protect);

router
  .route('/')
  .get(revController.getAllReviews)
  .post(
    restrictTo('user'),
    revController.setTourUserId,
    revController.createReview,
  );

router
  .route('/:id')
  .get(revController.getRev)
  .patch(revController.updateRev)
  .delete(revController.deleteRev);
module.exports = router;
