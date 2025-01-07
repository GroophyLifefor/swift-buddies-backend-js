import Post from '@/models/post';
import { getUserIdByToken } from '@/models/user';
import { parseBearer } from '@/lib/utils';
import { createSimplePostComment } from '@/models/postComment';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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

  if (!req.body.postID) {
    return res
      .status(400)
      .json({ message: 'postID is required. (use body to send)' });
  }

  const post = await Post.findOne({ uid: req.body.postID });
  if (!post) {
    return res.status(404).json({ message: 'Post not found.' });
  }

  if (!req.body.content) {
    return res
      .status(400)
      .json({ message: 'content is required. (use body to send)' });
  }

  const uid = await createSimplePostComment({
    post_uid: req.body.postID,
    owner_uid: userId,
    content: req.body.content,
  });

  res.status(200).json({ uid });
}
