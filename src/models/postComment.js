import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import post from "./post";

const postCommentSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  post_uid: {
    type: String,
    required: true,
  },
  owner_uid: {
    type: String,
    required: true,
  },
  content_history: {
    type: [{
      content: {
        type: String,
        required: true
      },
      changeDate: {
        type: Date,
        required: true
      }
    }],
    required: true,
  },
  sharedDate: {
    type: Date,
    default: Date.now,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  likedBy: { // Array of user uids
    type: [String],
    default: [],
  }
});

const PostComment = mongoose.models.PostComment || mongoose.model('PostComment', postCommentSchema);

export async function createSimplePostComment({ post_uid, owner_uid, content }) {
  const uid = uuidv4();
  await PostComment.create({
    uid,
    post_uid,
    owner_uid,
    content_history: [
      {
        content,
        changeDate: Date.now()
      }
    ],
  });
  return uid;
}

export async function updatePostComment({ uid, content }) {
  await PostComment.updateOne(
    { uid },
    {
      $push: {
        content_history: {
          content,
          changeDate: Date.now()
        }
      }
    }
  );
}

export default PostComment;