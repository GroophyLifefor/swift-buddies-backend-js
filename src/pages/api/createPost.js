import Post from '@/models/post';
import { getUserIdByToken } from '@/models/user';
import { v4 as uuidv4 } from 'uuid';
import { DateTimeToString } from '@/lib/date';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const tokenFromHeader = req.headers.authorization;
  if (!tokenFromHeader) {
    return res
      .status(400)
      .json({ message: 'token is required. (use body to send)' });
  }

  if (!req.body.content) {
    return res
      .status(400)
      .json({ message: 'content is required. (use body to send)' });
  }

  const content = req.body.content;
  const hashtags = content.match(/#[a-z0-9]+/gi);

  const post = {
    uid: uuidv4(),
    owner_uid: await getUserIdByToken(tokenFromHeader),
    sharedDate: DateTimeToString(new Date()),
    content,
    images: req.body.images || [],
    likeCount: 0,
    likers: [],
    hashtags: hashtags || [],
    commentCount: 0,
    comments: [],
  };
  const newPost = new Post(post);
  newPost.save();

  res.status(200).json({ uid: post.uid });
}
