import Post from '@/models/post';
import { getUserIdByToken } from '@/models/user';
import { parseBearer } from '@/lib/utils';
import PostComment from "@/models/postComment";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const tokenFromHeader = parseBearer(req.headers.authorization);
  if (!tokenFromHeader) {
    return res
      .status(400)
      .json({ message: 'token is required. (use headers as "Authorization" to send)' });
  }

  const postCommentID = req.body.postCommentID;
  if (!postCommentID) {
    return res
      .status(400)
      .json({ message: 'postCommentID is required. (use body to send)' });
  }

  const postComment = await PostComment.findOne({ uid: postCommentID });
  if (!postComment) {
    return res.status(404).json({ message: 'PostComment not found.' });
  }

  const userid = await getUserIdByToken(tokenFromHeader);

  if (postComment.likedBy.includes(userid)) {
    postComment.likedBy = postComment.likedBy.filter((liker) => liker !== userid);
    postComment.likeCount -= 1;
    postComment.save();

    res.status(200).json({
      action: 'unliked',
    });
  } else {
    postComment.likedBy.push(userid);
    postComment.likeCount += 1;
    postComment.save();

    res.status(200).json({
      action: 'liked',
    });
  }
}
