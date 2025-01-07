import Post from '@/models/post';
import { getUserIdByToken } from '@/models/user';
import { parseBearer } from '@/lib/utils';
import PostComment, { updatePostComment } from '@/models/postComment';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const tokenFromHeader = parseBearer(req.headers.authorization);
  if (!tokenFromHeader) {
    return res.status(400).json({
      message: 'token is required. (use headers as "Authorization" to send)',
    });
  }

  const userId = await getUserIdByToken(tokenFromHeader);
  if (!userId) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (!req.body.commentID) {
    return res
      .status(400)
      .json({ message: 'commentID is required. (use body to send)' });
  }

  const comment = await PostComment.findOne({ uid: req.body.commentID });
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found.' });
  }

  if (comment.owner_uid !== userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (!req.body.newContent) {
    return res
      .status(400)
      .json({ message: 'newContent is required. (use body to send)' });
  }

  await updatePostComment({
    uid: req.body.commentID,
    content: req.body.newContent,
  });

  res.status(200).json({ uid: req.body.commentID });
}
