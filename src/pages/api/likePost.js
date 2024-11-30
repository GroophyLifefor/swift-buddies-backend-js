import Post from '@/models/post';
import { getUserIdByToken } from '@/models/user';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const tokenFromHeader = req.headers.authorization;
  if (!tokenFromHeader) {
    return res
      .status(400)
      .json({ message: 'token is required. (use headers as "Authorization" to send)' });
  }

  if (!req.body.post_uid) {
    return res
      .status(400)
      .json({ message: 'post_uid is required. (use body to send)' });
  }

  const post = await Post.findOne({ uid: req.body.post_uid });
  if (!post) {
    return res.status(404).json({ message: 'Post not found.' });
  }

  const userid = await getUserIdByToken(tokenFromHeader);

  if (post.likers.includes(userid)) {
    post.likers = post.likers.filter((liker) => liker !== userid);
    post.likeCount -= 1;
    post.save();

    res.status(200).json({
      action: 'unliked',
    });
  } else {
    post.likers.push(userid);
    post.likeCount += 1;
    post.save();

    res.status(200).json({
      action: 'liked',
    });
  }
}
