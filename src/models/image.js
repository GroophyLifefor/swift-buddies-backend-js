import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const imageSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  owner_uid: {
    type: String,
    required: true,
  },
  base64: {
    type: String,
    required: true,
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  }
});

const Image = mongoose.models.Image || mongoose.model('Image', imageSchema);

export async function createImage({ uid, owner_uid, base64, isPrivate, uploadDate }) {
  return await Image.create({
    uid,
    owner_uid,
    base64,
    isPrivate,
    uploadDate
  });
}

export async function getImageByUid(uid) {
  return await Image.findOne({ uid });
}

export async function getImagesByOwnerUid(owner_uid) {
  return await Image.find({ owner_uid });
}

export async function deleteImage(uid) {
  return await Image.findOneAndDelete({ uid });
}

export async function deleteImagesByOwnerUid(owner_uid) {
  const images = await Image.find({ owner_uid });
  await Image.deleteMany({ owner_uid });
  return images;
}

export default Image;