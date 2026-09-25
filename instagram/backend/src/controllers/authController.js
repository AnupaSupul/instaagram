const User = require('../models/User');

// POST /login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Return user without password
    const userObj = user.toJSON();
    delete userObj.password;
    res.json(userObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
