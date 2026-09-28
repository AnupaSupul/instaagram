

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // 3. Extract the token (everything after "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // 4. Verify the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach user info to the request object
    req.user = decoded;

    // 6. Continue to the next middleware / route handler
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
