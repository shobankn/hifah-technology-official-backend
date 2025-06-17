const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {
  let token = null;

  // 1. Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader) {
    token = authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : authHeader;
  }

  // 2. Check cookie if no token in header
  if (!token && req.cookies && req.cookies.Authorization) {
    const cookieToken = req.cookies.Authorization;
    token = cookieToken.startsWith('Bearer ') 
      ? cookieToken.split(' ')[1] 
      : cookieToken;
  }

  // 3. Reject if still no token found
  if (!token) {
    return res.status(401).json({ message: 'Access denied: No token provided.' });
  }

  // 4. Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Recommended: normalize to _id for Mongo compatibility
    req.admin = { _id: decoded._id || decoded.id };

    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authentication;
