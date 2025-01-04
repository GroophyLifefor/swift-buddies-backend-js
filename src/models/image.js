import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  owner_uid: {
    type: String,
    required: true,
  },
  base64: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Image || mongoose.model('Image', imageSchema);

export const getImageByUid = async (uid) => {
  const image = await Image.findOne({ uid });
  return image;
};


export const getImagesByOwnerUid = async (owner_uid) => {
  const images = await Image.find({ owner_uid });
  return images;
}

export const deleteImageByUid = async (uid) => {
  const image = await Image.findOneAndDelete({ uid });
  return;
}

export const deleteImagesByOwnerUid = async (owner_uid) => {
  const images = await Image.find({ owner_uid });
  await Image.deleteMany({ owner_uid });
  return;
}

export const createImage = async (owner_uid, base64) => {
  const uuid = uuidv4()
  const image = new Image({
    uid: uuid,
    owner_uid,
    base64,
  });
  await image.save();
  return image;
}