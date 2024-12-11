const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error.' });
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
    req.user = decoded; // Attach decoded user info to the request object
    next();
  });
};


// MongoDB Connection
mongoose
  .connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// User Schema and Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  membershipLevel: { type: String, default: 'Basic' },
});

const membershipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tier: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Membership = mongoose.model('Membership', membershipSchema);


// Routes

// Home Route
app.get('/', (req, res) => {
  res.send('Welcome to the main page!');
});

// Signup Route
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering user!' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required!' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password!' });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.status(200).json({ message: 'Login successful!', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in!' });
  }
});

// Membership Tiers Route
app.get('/membership-tiers', (req, res) => {
  const tiers = [
    { name: 'Basic', price: '$5 / month', desc: "Access to essential features and limited content." },
    { name: 'Standard', price: '$10 / month', desc: "Expanded features, priority support, and extra content." },
    { name: 'Premium', price: '$15 / month', desc: "Full access, exclusive content, and premium support." },
  ];
  res.json(tiers);
});

// Profile Routes
app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      membershipLevel: user.membershipLevel || 'Basic', // Include membershipLevel
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching profile data.' });
  }
});


app.put('/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { name, email, membershipLevel } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, membershipLevel },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'Profile updated successfully!', updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating profile.' });
  }
});

app.post('/select-membership', authenticateToken, async (req, res) => {
  const userId = req.user.id; // Get user ID from the token
  const { tier } = req.body; // The selected membership tier

  if (!tier) {
    return res.status(400).json({ message: 'Membership tier is required.' });
  }

  try {
    const existingMembership = await Membership.findOne({ userId });
    if (existingMembership) {
      // Update existing membership
      existingMembership.tier = tier;
      existingMembership.timestamp = new Date();
      await existingMembership.save();
    } else {
      // Create a new membership record if it doesn't exist
      const newMembership = new Membership({ userId, tier });
      await newMembership.save();
    }

    // Optionally update the user's membership level in the User model
    await User.findByIdAndUpdate(userId, { membershipLevel: tier });

    res.status(200).json({ message: 'Membership updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating membership.' });
  }
});


app.get('/check-membership/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const membership = await Membership.findOne({ userId });

    if (!membership) {
      return res.status(404).json({ message: 'Membership not found.' });
    }

    // Adjust expiration logic as needed (e.g., 30 days).
    const membershipDuration = 30 * 24 * 60 * 60 * 1000; // 30 days in ms
    const isExpired = new Date() - new Date(membership.timestamp) > membershipDuration;

    if (isExpired) {
      return res.status(400).json({ message: 'Membership has expired.' });
    }

    res.status(200).json({ message: 'Membership is valid.', membership });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error checking membership.', error });
  }
});

//forgot passs
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required!' });
  }
  try {
    // Simulate sending an email or handle recovery logic
    res.status(200).json({ message: 'Password reset link sent to your email!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing request.' });
  }
});

// Start the Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
