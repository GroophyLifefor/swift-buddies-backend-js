import { Storage } from '@google-cloud/storage';

let storage = null;
try {
  storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });
} catch (err) {
  console.error('Storage initialize error', err);
  throw new Error('Storage initialize error');
}

let bucket = null;
try {
  bucket = storage.bucket(process.env.GCLOUD_BUCKET_NAME);
} catch (err) {
  console.error('Bucket initialize error', err);
  throw new Error('Bucket initialize error');
}

async function saveImage(buffer, uid) {
  const uniqueName = `swiftbuddies-images/${uid}.png`;

  try {
    bucket.file(uniqueName).save(buffer, {
      contentType: 'image/png',
      gzip: true,
    });
    return true;
  } catch (err) {
    return false;
  }
}

async function getImage(uid) {
  return bucket.file(`swiftbuddies-images/${uid}.png`);
}

async function deleteImage(uid) {
  try {
    await bucket.file(`swiftbuddies-images/${uid}.png`).delete();
    return true;
  } catch (err) {
    return false;
  }
}

export { saveImage, getImage, deleteImage };
