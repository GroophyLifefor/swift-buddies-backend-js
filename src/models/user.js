import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  registerType: {
    type: String,
    required: true,
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
  name: {
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

export { User, isUserRegistered };

