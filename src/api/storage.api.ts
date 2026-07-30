/**
 * Cloudflare R2 Image Storage Utility Module
 * Handles image upload to Cloudflare R2 via Worker API / S3 Presigned Endpoint.
 */

export interface UploadImageResult {
  imageUrl: string;
}

const R2_PUBLIC_DOMAIN =
  process.env.EXPO_PUBLIC_R2_PUBLIC_DOMAIN || 'https://cdn.odaplove.com';
const R2_UPLOAD_ENDPOINT =
  process.env.EXPO_PUBLIC_R2_UPLOAD_ENDPOINT ||
  'https://r2-upload.odaplove.workers.dev/upload';

/**
 * Uploads a local image file to Cloudflare R2 Bucket
 * @param fileUri Local image URI (from expo-image-picker)
 * @param fileName Optional file name
 */
export async function uploadImageToR2(
  fileUri: string,
  fileName?: string
): Promise<UploadImageResult> {
  try {
    const name =
      fileName ||
      `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.jpg`;

    let body: any;

    if (fileUri.startsWith('data:') || fileUri.startsWith('blob:')) {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('file', blob, name);
      body = formData;
    } else {
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        name,
        type: 'image/jpeg',
      } as any);
      body = formData;
    }

    const res = await fetch(R2_UPLOAD_ENDPOINT, {
      method: 'POST',
      body,
    });

    if (!res.ok) {
      console.warn(
        `R2 upload endpoint response error (${res.status}). Retaining local image URI.`
      );
      return { imageUrl: fileUri };
    }

    const data = await res.json();
    if (data && (data.imageUrl || data.url)) {
      return { imageUrl: data.imageUrl || data.url };
    }

    return { imageUrl: fileUri };
  } catch (error) {
    console.error('uploadImageToR2 error:', error);
    // Return local fileUri on error so local image preview never disappears!
    return { imageUrl: fileUri };
  }
}
