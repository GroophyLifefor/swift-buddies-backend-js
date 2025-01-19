import { User } from '@/models/user';
import { createImage } from '@/models/image';
import { parseBearer } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { saveImage, getImage } from "@/lib/image_db";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Adjust this limit as needed
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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

  const base64 = req.body.base64;
  if (!base64) {
    return res.status(400).json({ message: 'base64 is required. (use body to send)' });
  }

  // Extract content type from the base64 string
  const contentTypeMatch = base64.match(/^data:([^;]+);base64,/);
  const contentType = contentTypeMatch ? contentTypeMatch[1] : 'image/heic';
  const rawData = base64.replace(/^data:image\/\w+;base64,/, '');
  
  let buffer;
  try {
    buffer = Buffer.from(rawData, 'base64');
  } catch {
    return res.status(400).json({ message: 'Invalid base64' });
  }
  
  const uid = uuidv4();
  const isOkay = await saveImage(buffer, uid, contentType);

  if (!isOkay) {
    return res.status(500).json({ message: 'Upload failed' });
  }

  const url = await getImage(uid);
  return res.status(200).json({ uid, url });
}
