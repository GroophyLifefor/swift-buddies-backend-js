import { User } from '@/models/user';
import { createImage } from '@/models/image';
import { parseBearer } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb' // Adjust this limit as needed
    }
  }
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

  const { base64, isPrivate = false } = req.body;

  if (!base64) {
    return res.status(400).json({
      message: 'base64 image data is required',
    });
  }

  // Validate base64 format
  if (!base64.match(/^data:image\/(jpeg|png|gif|webp);base64,/)) {
    return res.status(400).json({
      message: 'Invalid image format. Must be base64 encoded image.',
    });
  }

  try {
    const imageUid = uuidv4();
    await createImage({
      uid: imageUid,
      owner_uid: user.uid,
      base64: base64,
      isPrivate: isPrivate,
      uploadDate: new Date()
    });

    return res.status(200).json({
      uid: imageUid
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({
      message: 'Failed to upload image'
    });
  }
} 