const { validationResult } = require('express-validator');

// Generic middleware — runs after express-validator's check(...) rules on a route.
// If validation errors exist, respond 400 with a clean list. Otherwise, continue.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = validate;