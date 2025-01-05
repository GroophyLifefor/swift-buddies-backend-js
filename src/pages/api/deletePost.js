import Post from '@/models/post';
import { getImageByUid } from '@/models/image';
import { getUserIdByToken } from '@/models/user';
import { v4 as uuidv4 } from 'uuid';
import { DateTimeToString } from '@/lib/date';
import { parseBearer } from '@/lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
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

  const postID = req.query.postID;
  if (!postID) {
    return res
      .status(400)
      .json({ message: 'postID is required. (use query to send)' });
  }

  const post = await Post.findOne({ uid: postID });
  if (!post) {
    return res.status(404).json({ message: 'Post not found.' });
  }

  if (post.owner_uid !== userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const result = await Post.deleteOne({ uid: postID });
  if (result.deletedCount === 1) {
    res.status(200).json({ message: 'Post deleted successfully.' });
  } else {
    res.status(500).json({ message: 'Internal Server Error - matched results can not deleted.' });
  } 
}
