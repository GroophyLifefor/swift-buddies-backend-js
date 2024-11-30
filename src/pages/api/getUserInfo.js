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

  const userid = req.query.userid;
  if (!userid) {
    return res
      .status(400)
      .json({ message: 'userid is required. (use query to send)' });
  }

  const user = await User.findOne({ token: tokenFromHeader });
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const targetUser = await User.findOne({ uid: userid });
  if (!targetUser) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const response = {
    registerType: targetUser.registerType,
    registerDate: DateTimeToString(targetUser.registerDate),
    lastLoginDate: DateTimeToString(targetUser.lastLoginDate),
    email: targetUser.email,
    name: targetUser.name,
    username: targetUser.username,
    picture: targetUser.picture || '',
  }

  res.status(200).json(response);
}
