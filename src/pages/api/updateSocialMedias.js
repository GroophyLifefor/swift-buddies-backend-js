import Post from '@/models/post';
import { getUserIdByToken, User } from '@/models/user';
import { parseBearer } from '@/lib/utils';
import PostComment, { updatePostComment } from '@/models/postComment';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
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

  /*
  {
    socialMedias: [
      {
        key: 'linkedin',
        value: 'https://www.linkedin.com/in/username',
      },
    ]
  }
  */
  if (!req.body.socialMedias) {
    return res.status(400).json({
      message:
        'socialMedias is required. (use body to send, value should be array)',
    });
  }

  const socialMedias = req.body.socialMedias;
  const socialMediaTypes = ['linkedin', 'github'];

  for (const socialMedia of socialMedias) {
    if (!socialMediaTypes.includes(socialMedia.key)) {
      return res
        .status(400)
        .json({
          message: `Invalid social media type. (valids: ${socialMediaTypes.join(
            ', '
          )})`,
        });
    }
  }

  for (const socialMedia of socialMedias) {
    const index = user.socialMedias?.findIndex(
      (item) => item.key === socialMedia.key
    );
    if (index === -1) {
      user.socialMedias.push(socialMedia);
    } else {
      user.socialMedias[index].value = socialMedia.value;
    }
  }

  user.socialMedias = user.socialMedias.filter(
    (item, index, self) => index === self.findIndex((t) => t.key === item.key)
  );
  await user.save();
  let newData = user.socialMedias;
  newData = newData.map(t => ({ key: t.key, value: t.value })); 

  res.status(200).json({ message: 'Social media updated', data: newData });
}
