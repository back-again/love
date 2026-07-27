/**
 * Cloudflare R2 Image Storage Utility Module
 * Stores uploaded image URLs pointing to Cloudflare R2 CDN bucket.
 */

export interface UploadImageResult {
  imageUrl: string;
}

export async function uploadImageToR2(
  fileUri: string,
  fileName: string,
): Promise<UploadImageResult> {
  try {
    // 1. Prepare form data for Cloudflare R2 upload or worker endpoint
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name: fileName || `img_${Date.now()}.jpg`,
      type: 'image/jpeg',
    } as any);

    // Placeholder R2 Upload endpoint / Presigned URL Handler
    const R2_UPLOAD_ENDPOINT =
      process.env.EXPO_PUBLIC_R2_UPLOAD_ENDPOINT ||
      'https://r2-upload.odaplove.workers.dev/upload';

    const response = await fetch(R2_UPLOAD_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error(`R2 Upload Failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      imageUrl: data.url || data.public_url,
    };
  } catch (error) {
    console.error('uploadImageToR2 error:', error);
    throw error;
  }
}
