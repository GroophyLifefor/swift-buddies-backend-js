import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true
  },
  owner_uid: {
    type: String,
    required: true
  },
  sharedDate: {
    type: Date,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    required: false
  },
  likeCount: {
    type: Number,
    required: true,
    default: 0
  },
  likers: {
    type: [String], // Array of uid's
    required: true,
    default: []
  },
  hashtags: {
    type: [String],
    required: true
  },
  comments: {
    type: [String], // Array of comment uid's
    required: true
  }
});

export default mongoose.models.Post || mongoose.model('Post', postSchema);

