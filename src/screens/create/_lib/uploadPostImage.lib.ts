import { uploadImageToR2, UploadImageResult } from '@/api/storage.api';

export interface UploadPostImageParams {
  uri: string;
  fileName?: string;
}

export async function uploadPostImage({
  uri,
  fileName,
}: UploadPostImageParams): Promise<UploadImageResult> {
  const name = fileName || `img_${Date.now()}.jpg`;
  return await uploadImageToR2(uri, name);
}
