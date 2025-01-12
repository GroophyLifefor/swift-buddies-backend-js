import { getUserIdByToken } from '@/models/user';
import { getImageByUid } from '@/models/image';
import { parseBearer } from '@/lib/utils';
import { getImage } from '@/lib/image_db';

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

  const image = await getImage(uid);
  let downloaded;
  try {
    downloaded = await image.download();
  } catch (err) {
    return res.status(404).json({ message: 'Failed to get image.' });
  }

  const base64code = downloaded[0].toString('base64');
  const base64 = `data:image/png;base64,${base64code}`;

  res.status(200).json({ base64 });
}
