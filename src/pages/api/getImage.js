import { getUserIdByToken } from '@/models/user';
import { getImageByUid } from "@/models/image";
import { parseBearer } from '@/lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const tokenFromHeader = parseBearer(req.headers.authorization);
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

  const uid = req.query.uid;
  if (!uid) {
    return res
      .status(400)
      .json({ message: 'uid is required. (use query to send)' });
  }

  const image = await getImageByUid(uid);
  if (!image) {
    return res.status(404).json({ message: 'Image not found.' });
  }

  if (image.isPrivate && image.owner_uid !== userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  res.status(200).json({ base64: image.base64 });
}
