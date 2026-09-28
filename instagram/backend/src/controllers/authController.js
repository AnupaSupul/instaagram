const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Find user by username (include password for comparison)
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // 2. Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // 3. Create JWT token
    const token = jwt.sign(
      { id: user._id },          // payload — just the user ID
      process.env.JWT_SECRET,     // secret from .env
      { expiresIn: '1d' }        // expires in 1 day
    );

    // 4. Return user (without password) + token
    const userObj = user.toJSON();
    delete userObj.password;
    res.json({ user: userObj, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
