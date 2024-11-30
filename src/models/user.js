import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  registerType: {
    type: String,
    required: true,
  },
  // new field, registerDate
  registerDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  lastLoginDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  email: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true
  },
  name: { // means display name
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

/**
 * Check if a user is already registered by email
 * @param {string} email - The email to check
 * @returns {Promise<Object|null>} - User object if the user is registered, null otherwise
 */
const isUserRegistered = async (email) => {
  const user = await User.findOne({ email });
  return user; // Returns the user object if user exists, null otherwise
};

/**
 * Get the user ID by token
 * 
 * @param {string} token - The token to check
 * @returns {string} - The user ID
 */
const getUserIdByToken = async (token) => {
  const user = await User.findOne({
    token,
  });
  return user.uid;
}

export { User, isUserRegistered, getUserIdByToken };

