import { User } from '@/models/user';
import { getImageByUid, deleteImage } from '@/models/image';
import { parseBearer } from '@/lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
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

  const { uid } = req.query;
  if (!uid) {
    return res.status(400).json({
      message: 'image uid is required',
    });
  }

  const image = await getImageByUid(uid);
  if (!image) {
    return res.status(404).json({ message: 'Image not found.' });
  }

  // Check if user owns the image
  if (image.owner_uid !== user.uid) {
    return res.status(403).json({ message: 'Forbidden: Cannot delete other users images' });
  }

  try {
    await deleteImage(uid);
    return res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({ message: 'Failed to delete image' });
  }
} 