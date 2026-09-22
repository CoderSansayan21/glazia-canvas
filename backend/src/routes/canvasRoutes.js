const express = require('express');
const { body, param } = require('express-validator');
const canvasController = require('../controllers/canvasController');
const validate = require('../middleware/validate');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// All canvas routes use optionalAuth — works for both guests and logged-in users.
// See canvasController.js for how ownership is enforced per-request.
router.use(optionalAuth);

const elementValidationRules = [
  body('elements').optional().isArray().withMessage('elements must be an array'),
  body('elements.*.id').optional().isString(),
  body('elements.*.type').optional().isIn(['rect', 'circle', 'text']).withMessage('Invalid element type'),
  body('elements.*.x').optional().isNumeric(),
  body('elements.*.y').optional().isNumeric(),
  body('layerOrder').optional().isArray().withMessage('layerOrder must be an array'),
];

// @route  POST /api/canvases
router.post(
  '/',
  [
    body('name').optional().trim().isLength({ max: 100 }).withMessage('Name too long'),
    ...elementValidationRules,
  ],
  validate,
  canvasController.createCanvas
);

// @route  GET /api/canvases
router.get('/', canvasController.getCanvases);

// @route  GET /api/canvases/:id
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid canvas id')],
  validate,
  canvasController.getCanvasById
);

// @route  PUT /api/canvases/:id
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid canvas id'),
    body('name').optional().trim().isLength({ max: 100 }).withMessage('Name too long'),
    ...elementValidationRules,
  ],
  validate,
  canvasController.updateCanvas
);

// @route  DELETE /api/canvases/:id
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid canvas id')],
  validate,
  canvasController.deleteCanvas
);

module.exports = router;