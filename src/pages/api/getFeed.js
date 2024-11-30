import Post from '@/models/post';
import { getUserIdByToken, User } from '@/models/user';
import { v4 as uuidv4 } from 'uuid';
import { DateTimeToString } from '@/lib/date';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const tokenFromHeader = req.headers.authorization;
  if (!tokenFromHeader) {
    return res
      .status(400)
      .json({ message: 'token is required. (use headers as "Authorization" to send)' });
  }

  const user = await User.findOne({ token: tokenFromHeader });
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (!req.query.range) {
    return res
      .status(400)
      .json({ message: 'range is required. (use query to send)' });
  }

  const ranges = req.query.range.split('-');
  if (!ranges[0] || !ranges[1]) {
    return res.status(400).json({
      message: 'range is invalid, value not defined. (use query to send)',
    });
  }

  if (ranges[0] < 0 || ranges[1] < 0) {
    return res.status(400).json({
      message:
        'range is invalid, values cannot lower than zero. (use query to send)',
    });
  }

  if (ranges[0] > ranges[1]) {
    return res.status(400).json({
      message:
        'range is invalid, start value cannot be greater than end value. (use query to send)',
    });
  }

  const startRange = parseInt(ranges[0]);
  const endRange = parseInt(ranges[1]);

  if (isNaN(startRange) || isNaN(endRange)) {
    return res.status(400).json({
      message: 'range is invalid, values must be integer. (use query to send)',
    });
  }

  const limit = endRange - startRange > 50 ? 50 : endRange - startRange;

  let posts = [];
  if (limit !== 0) {
    posts = await Post.find()
      .sort({ sharedDate: -1 })
      .skip(startRange)
      .limit(limit);
  }

  const userUID = await getUserIdByToken(tokenFromHeader);
    
  const feed = [];
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const user = await User.findOne({ uid: post.owner_uid });

    const likerProfiles = [];
    for (let j = 0; j < post.likers.length; j++) {
      const liker = await User.findOne({ uid: post.likers[j] });
      likerProfiles.push({
        name: liker.name,
        picture: liker.picture,

        // new field, check if current user liked this post
        isYou: liker.uid === userUID,
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
        sharedDate: post.sharedDate,
        content: post.content,
        images: post.images,
        likeCount: post.likeCount,
        
        // new field, check if current user liked this post
        isLikedByYou: isLiked,

        likers: likerProfiles,
        commentCount: post.commentCount,
        comments: post.comments,
        hashtags: post.hashtags,
      },
    })
  }


  res.status(200).json({feed});
}
