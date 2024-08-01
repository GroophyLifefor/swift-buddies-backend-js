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
    type: String,
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
    required: true
  },
  likers: {
    type: [String], // Array of uid's
    required: true
  },
  hashtags: {
    type: [String],
    required: true
  },
  commentCount: {
    type: Number,
    required: true
  },
  comments: {
    type: [
      {
        owner_uid: {
          type: String,
          required: true
        },
        content: {
          type: String,
          required: true
        },
        likeCount: {
          type: Number,
          required: true
        },
        likers: {
          type: [String], // Array of uid's
          required: true
        }
      }
    ],
    required: true
  }
});

export default mongoose.models.Post || mongoose.model('Post', postSchema);

