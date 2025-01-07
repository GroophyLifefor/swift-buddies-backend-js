import PostComment from '@/models/postComment';
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

  const postCommentID = req.query.postCommentID;
  if (!postCommentID) {
    return res
      .status(400)
      .json({ message: 'postCommentID is required. (use query to send)' });
  }

  const postComment = await PostComment.findOne({ uid: postCommentID });
  if (!postComment) {
    return res.status(404).json({ message: 'PostComment not found.' });
  }

  if (postComment.owner_uid !== userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const result = await PostComment.deleteOne({ uid: postCommentID });
  if (result.deletedCount === 1) {
    res.status(200).json({ message: 'PostComment deleted successfully.' });
  } else {
    res.status(500).json({ message: 'Internal Server Error - matched results can not deleted.' });
  } 
}
