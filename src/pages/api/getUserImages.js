import { User } from '@/models/user';
import { getImagesByOwnerUid } from '@/models/image';
import { parseBearer } from '@/lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
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

  try {
    const images = await getImagesByOwnerUid(user.uid);
    return res.status(200).json({
      images: images.map(img => ({
        uid: img.uid,
        isPrivate: img.isPrivate,
        uploadDate: img.uploadDate
      }))
    });
  } catch (error) {
    console.error('Error fetching user images:', error);
    return res.status(500).json({ message: 'Failed to fetch images' });
  }
} 