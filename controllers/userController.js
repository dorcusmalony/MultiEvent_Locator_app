const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');
const User = require('../models/user');

const register = async (req, res) => {
  try {
    const { username, email, password, location, preferences } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, location, preferences });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      const field = error.errors[0].path;
      return res.status(400).json({ message: `${field} must be unique` });
    }
    res.status(500).json({ message: 'Error registering user', error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { location, preferences } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.update({ location, preferences });
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

module.exports = { register, login, updateUser };