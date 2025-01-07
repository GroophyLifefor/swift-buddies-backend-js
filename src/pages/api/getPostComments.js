import Post from '@/models/post';
import { User, getUserById } from '@/models/user';
import { v4 as uuidv4 } from 'uuid';
import { DateTimeToString, StringToDateTime } from '@/lib/date';
import { parseBearer } from '@/lib/utils';
import PostComment from '@/models/postComment';

export const fetchCache = 'force-dynamic';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const tokenFromHeader = parseBearer(req.headers.authorization);
  if (!tokenFromHeader) {
    return res.status(400).json({
      message: 'token is required. (use headers as "Authorization" to send)',
    });
  }

  const user = await User.findOne({ token: tokenFromHeader });
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (!req.query.offset) {
    return res
      .status(400)
      .json({ message: 'offset is required. (use query to send)' });
  }

  if (!req.query.limit) {
    return res
      .status(400)
      .json({ message: 'limit is required. (use query to send)' });
  }

  if (isNaN(req.query.offset) || isNaN(req.query.limit)) {
    return res.status(400).json({
      message:
        'offset or limit is invalid, values must be integer. (use query to send)',
    });
  }

  const offset = parseInt(req.query.offset);
  const limit = parseInt(req.query.limit);

  if (offset < 0 || limit < 0) {
    return res.status(400).json({
      message:
        'offset and limit must be non-negative values. (use query to send)',
    });
  }

  const sortBy = req.query.sortBy || 'sharedDate';
  if (sortBy !== 'sharedDate' && sortBy !== 'likeCount') {
    return res.status(400).json({
      message:
        'sortBy is invalid, values must be "sharedDate" or "likeCount". (use query to send)',
    });
  }

  const sortOrder = req.query.sortOrder || 'desc';
  if (sortOrder !== 'asc' && sortOrder !== 'desc') {
    return res.status(400).json({
      message:
        'sortOrder is invalid, values must be "asc" or "desc". (use query to send)',
    });
  }

  let postComments = [];

  if (limit !== 0) {
    postComments = await PostComment.find()
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(offset)
      .limit(limit);
  }

  const feed = [];
  for (const comment of postComments) {
    const owner = await getUserById(comment.owner_uid);
    if (!owner) {
      console.log('Owner not found, may some data is corrupted.');
      continue;
    }

    const recentContent = comment.content_history.sort((a, b) => {
      return a.changeDate < b.changeDate ? 1 : -1;
    })[0];

    const likedBy = [];
    for (const liker of comment.likedBy) {
      const likerProfile = await getUserById(liker);
      if (!likerProfile) {
        console.log('Liker not found, may some data is corrupted.');
        continue;
      }

      likedBy.push({
        isSelf: liker === user.uid,
        name: likerProfile.name || '',
        avatar: likerProfile.avatar || '',
      });
    }

    feed.push({
      uid: comment.uid,
      owner: {
        uid: owner.uid || '',
        name: owner.name || '',
        avatar: owner.avatar || '',
      },
      content: recentContent.content,
      isEdited: comment.content_history.length > 1,
      lastEditDate:
        comment.content_history.length > 1
          ? DateTimeToString(comment.content_history[1].changeDate)
          : DateTimeToString(comment.sharedDate),
      sharedDate: DateTimeToString(comment.sharedDate),
      likeCount: comment.likeCount,
      likedBy,
    });
  }

  res.status(200).json({
    sortBy,
    sortOrder,
    feed: feed.filter((item) => item !== null),
  });
}
