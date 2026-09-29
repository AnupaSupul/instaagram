const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    //  Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    //  Create JWT token
    const token = jwt.sign(
      { id: user._id },          // payload  just the user ID
      process.env.JWT_SECRET,    
      { expiresIn: '1d' }       
    );

    // Return user , token
    const userObj = user.toJSON();
    delete userObj.password;
    res.json({ user: userObj, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
