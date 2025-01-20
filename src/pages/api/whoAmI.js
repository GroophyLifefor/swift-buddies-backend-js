import Post from '@/models/post';
import { getUserIdByToken, User } from '@/models/user';
import { v4 as uuidv4 } from 'uuid';
import { DateTimeToString } from '@/lib/date';
import { parseBearer } from '@/lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const tokenFromHeader = parseBearer(req.headers.authorization);
  if (!tokenFromHeader) {
    return res
      .status(400)
      .json({ message: 'token is required. (use headers as "Authorization" to send)' });
  }

  const user = await User.findOne({ token: tokenFromHeader });
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const response = {
    registerType: user.registerType,
    registerDate: DateTimeToString(user.registerDate),
    lastLoginDate: DateTimeToString(user.lastLoginDate),
    email: user.email,
    name: user.name,
    username: user.username,
    picture: user.picture || '',
  }

  user.socialMedias?.forEach((socialMedia) => {
    response[socialMedia.key] = socialMedia.value;
  });

  res.status(200).json(response);
}
