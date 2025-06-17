const bcrypt = require('bcryptjs');
const Admin = require('../models/userModel');
const jwt = require('jsonwebtoken');

const AdminSignup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({ email, password: hashedPassword });

    res.status(201).json({ message: 'Admin registered successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error.' });
  }
};




const AdminSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(401).json({ message: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password.' });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '5h',
    });

    res.cookie('Authorization', `Bearer ${token}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
    });

    res.status(200).json({ message: 'Login successful.', token });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error.' });
  }
};



const AdminSignout = (req, res) => {
  try {
    res.clearCookie('Authorization');
    res.status(200).json({ message: 'Logout successful.' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error.' });
  }
};


module.exports = {AdminSignup,AdminSignin,AdminSignout}