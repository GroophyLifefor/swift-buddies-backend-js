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
      .json({ message: 'token is required. (use body to send)' });
  }

  if (!req.body.range) {
    return res
      .status(400)
      .json({ message: 'range is required. (use body to send)' });
  }

  const ranges = req.body.range.split('-');
  if (!ranges[0] || !ranges[1]) {
    return res.status(400).json({
      message: 'range is invalid, value not defined. (use body to send)',
    });
  }

  if (ranges[0] < 0 || ranges[1] < 0) {
    return res.status(400).json({
      message:
        'range is invalid, values cannot lower than zero. (use body to send)',
    });
  }

  if (ranges[0] > ranges[1]) {
    return res.status(400).json({
      message:
        'range is invalid, start value cannot be greater than end value. (use body to send)',
    });
  }

  const startRange = parseInt(ranges[0]);
  const endRange = parseInt(ranges[1]);

  if (isNaN(startRange) || isNaN(endRange)) {
    return res.status(400).json({
      message: 'range is invalid, values must be integer. (use body to send)',
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
      });
    }

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
        likers: likerProfiles,
        commentCount: post.commentCount,
        comments: post.comments,
        hashtags: post.hashtags,
      },
    })
  }


  res.status(200).json({feed});
}
