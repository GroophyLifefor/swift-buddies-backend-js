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

  const limit = 50;

  let posts = [];
  if (limit !== 0) {
    posts = await Post.find({ owner_uid: await getUserIdByToken(tokenFromHeader) })
      .sort({ sharedDate: -1 })
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
