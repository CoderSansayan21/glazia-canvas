const jwt = require('jsonwebtoken');

// Protects routes — requires a valid JWT in the Authorization header.
// On success, attaches { id: userId } to req.user for use in controllers.
const protect = (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    // Let errorHandler.js format JsonWebTokenError / TokenExpiredError nicely
    next(err);
  }
};

// Optional auth — doesn't block the request if no token,
// but attaches req.user if a valid token IS present. Used on canvas routes
// so both guest users and logged-in users can use the app, while logged-in
// users' canvases get tagged with their userId.
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id };
    } catch (err) {
      // invalid/expired token on an optional route — just treat as guest, don't block
    }
  }
  next();
};

module.exports = { protect, optionalAuth };