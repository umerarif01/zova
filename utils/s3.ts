"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function uploadToS3({
  fileName,
  fileType,
  chatbotId,
}: {
  fileName: string;
  fileType: string;
  chatbotId: string;
}): Promise<{
  uploadUrl: string;
  file_key: string;
  file_name: string;
  chatbotId: string;
}> {
  try {
    const file_key = `${chatbotId}/${Date.now().toString()}-${fileName.replace(
      /\s+/g,
      "-"
    )}`;

    const s3 = new S3Client({
      region: process.env.AWS_S3_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
      },
    });

    // Generate a pre-signed URL for uploading the file
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: file_key,
      ContentType: fileType, // Ensure correct MIME type
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // URL expires in 1 hour

    return {
      uploadUrl,
      file_key,
      file_name: fileName,
      chatbotId,
    };
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
}

export async function getS3Url(file_key: string): Promise<string> {
  const s3Endpoint =
    process.env.AWS_S3_ENDPOINT ||
    `https://${process.env.AWS_S3_BUCKET!}.s3.${process.env
      .AWS_S3_REGION!}.amazonaws.com`;
  return `${s3Endpoint}/${file_key}`;
}
