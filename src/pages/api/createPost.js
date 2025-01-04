import Post from '@/models/post';
import { createImage } from '@/models/image';
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
      .json({
        message: 'token is required. (use headers as "Authorization" to send)',
      });
  }

  const userId = await getUserIdByToken(tokenFromHeader);
  if (!userId) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (!req.body.content) {
    return res
      .status(400)
      .json({ message: 'content is required. (use body to send)' });
  }

  const imageIDs = [];
  if (!!req.body.images) {
    if (!Array.isArray(req.body.images)) {
      return res
        .status(400)
        .json({ message: 'images must be an array. (use body to send)' });
    }

    for (let i = 0; i < req.body.images.length; i++) {
      if (typeof req.body.images[i] !== 'string') {
        return res
          .status(400)
          .json({ message: 'images must be a string. (use body to send)' });
      }

      const base64 = req.body.images[i];
      const imageID = await createImage(userId, base64);
      imageIDs.push(imageID);
    }
  }

  const content = req.body.content;
  const hashtags = content.match(/#[a-z0-9]+/gi);

  const post = {
    uid: uuidv4(),
    owner_uid: userId,
    sharedDate: DateTimeToString(new Date()),
    content,
    images: imageIDs,
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
