import { Storage } from '@google-cloud/storage';

export const getGCPCredentials = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.GCP_PRIVATE_KEY
    ? {
        credentials: {
          client_email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GCP_PRIVATE_KEY,
        },
        projectId: process.env.GCP_PROJECT_ID,
      }
    : {};
  }

  return {
    projectId: process.env.GCLOUD_PROJECT_ID,
  }
};


let storage = null;
try {
  storage = new Storage(getGCPCredentials());
} catch (err) {
  console.error('Storage initialize error', err);
  throw new Error('Storage initialize error');
}

let bucket = null;
try {
  bucket = await storage.bucket(process.env.GCLOUD_BUCKET_NAME);
} catch (err) {
  console.warn('did you do Application Default Credentials (ADC) signup for local development?');
  console.error('Bucket initialize error', err);
  throw new Error('Bucket initialize error');
}

async function saveImage(buffer, uid, contentType = 'image/heic') {
  const extension = contentType.split('/')[1];
  const uniqueName = `swiftbuddies-images/${uid}.${extension}`;

  try {
    await bucket.file(uniqueName).save(buffer, {
      contentType: contentType,
      gzip: true,
    });
    return true;
  } catch (err) {
    console.warn('saveImage error', err);
    return false;
  }
}

async function getImage(uid) {
  try {
    const heicFile = await bucket.file(`swiftbuddies-images/${uid}.heic`);
    const [exists] = await heicFile.exists();
    if (exists) return heicFile;
  } catch (err) {
    console.warn('HEIC file not found, trying PNG');
  }

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
