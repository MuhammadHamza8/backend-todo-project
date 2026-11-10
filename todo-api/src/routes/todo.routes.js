const router = require('express').Router();
const { body, param } = require('express-validator');
const ctrl = require('../controllers/todo.controller');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.use(auth); // protects ALL todo routes

const idRule = param('id').isMongoId().withMessage('Invalid todo ID');

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().isString(),
    body('completed').optional().isBoolean().withMessage('completed must be boolean'),
  ],
  validate,
  ctrl.create
);

router.get('/', ctrl.getAll);
router.get('/:id', [idRule], validate, ctrl.getOne);

router.put(
  '/:id',
  [
    idRule,
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().isString(),
    body('completed').optional().isBoolean().withMessage('completed must be boolean'),
  ],
  validate,
  ctrl.update
);

router.delete('/:id', [idRule], validate, ctrl.remove);

module.exports = router;