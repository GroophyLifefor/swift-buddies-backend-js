import { getUserIdByToken, User } from '@/models/user';
import { parseBearer } from '@/lib/utils';

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

  const newUsername = req.body.username;
  if (!newUsername) {
    return res.status(400).json({
      message: 'username is required. (use body to send)',
    });
  }

  const isAlreadyRegistered = await User.findOne({ username: newUsername });
  if (isAlreadyRegistered) {
    return res.status(400).json({ message: 'Username already registered' });
  }

  user.username = newUsername;
  await user.save();

  res.status(200).json({ message: 'Username updated', data: { username: newUsername } });
}
