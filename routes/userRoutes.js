const express = require('express');
const multer = require('multer');

const authController = require('./../controllers/authController');
const usersController = require('./../controllers/usersController');
// const revController = require('./../controllers/revController');
// const factory = require('./../controllers/handlerFactory');

const upload = multer({ dest: 'public/img/users' });
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.delete('/deleteMe', usersController.deleteMe);
router.patch('/updateMyPassword', authController.updatePassword);
router.route('/me').get(usersController.getMe, usersController.getUser);
router.patch('/updateMe', upload.single('photo'), usersController.updateMe);

router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createUser);

router
  .route('/:id')
  .get(usersController.getUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
