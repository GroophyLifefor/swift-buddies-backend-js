import { User } from '@/models/user';
import { getImageByUid } from '@/models/image';
import { parseBearer } from '@/lib/utils';
import { deleteImage } from '@/lib/image_db';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  return res
    .status(406)
    .json({ message: 'Deleting images are temporaly disabled.' });

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

  const isDeleted = await deleteImage(uid);
  if (!isDeleted) {
    return res.status(500).json({ message: 'Delete failed' });
  }
}
