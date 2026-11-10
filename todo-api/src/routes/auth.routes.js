const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  ctrl.signup
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  ctrl.login
);

const refreshRule = body('refreshToken').isString().notEmpty().withMessage('refreshToken is required');

router.post('/refresh', [refreshRule], validate, ctrl.refresh);
router.post('/logout', [refreshRule], validate, ctrl.logout);
router.post('/logout-all', auth, ctrl.logoutAll);

router.get('/me', auth, ctrl.me);

module.exports = router;