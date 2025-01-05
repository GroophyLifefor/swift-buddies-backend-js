import Post from '@/models/post';
import { getUserIdByToken, User } from '@/models/user';
import { v4 as uuidv4 } from 'uuid';
import { DateTimeToString, StringToDateTime } from '@/lib/date';
import { parseBearer } from '@/lib/utils';

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

  const since = req.query.since;
  let posts = [];

  if (!since) {
    if (limit !== 0) {
      posts = await Post.find()
        .sort({ sharedDate: -1 })
        .skip(offset)
        .limit(limit);
    }
  } else {
    const parsedDate = StringToDateTime(since);
    if (!parsedDate || parsedDate.error) {
      return res.status(400).json({
        message: 'since parameter must be a valid date format',
      });
    }

    if (limit !== 0) {
      posts = await Post.find({ sharedDate: { $gt: parsedDate.date } })
        .sort({ sharedDate: -1 })
        .skip(offset)
        .limit(limit  )
    }

  }

  const userUID = await getUserIdByToken(tokenFromHeader);

  const feed = [];
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const user = await User.findOne({ uid: post.owner_uid });

    const likerProfiles = [];
    for (let j = 0; j < post.likers.length; j++) {
      console.log(post.likers[j]);
      const liker = await User.findOne({ uid: post.likers[j] });
      likerProfiles.push({
        name: liker.name,
        picture: liker.picture,
        uid: liker.uid,

        // new field, check if current user liked this post
        isSelf: liker.uid === userUID,
      });
    }

    const isLiked = post.likers.includes(userUID);

    feed.push({
      user: {
        name: user.name,
        picture: user.picture,
      },
      post: {
        uid: post.uid,
        sharedDate: DateTimeToString(new Date(post.sharedDate)),
        content: post.content,
        images: post.images,
        likeCount: post.likeCount,

        // new field, check if current user liked this post
        isLiked: isLiked,

        likers: likerProfiles,
        commentCount: post.commentCount,
        // TODO: For comments need a new endpoint request
        // comments: post.comments,
        hashtags: post.hashtags,
        isSelf: post.owner_uid === userUID,
      },
    });
  }

  res.status(200).json({ feed });
}
