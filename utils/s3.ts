"use server";

import { PutObjectCommandOutput, S3 } from "@aws-sdk/client-s3";

export async function uploadToS3(
  formData: FormData
): Promise<{ file_key: string; file_name: string; chatbotId: string }> {
  try {
    // Get file from FormData
    const file = formData.get("file") as File;
    const chatbotId = formData.get("chatbotId") as string;
    if (!(file instanceof File)) {
      throw new Error("File must be a file");
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const s3 = new S3({
      region: process.env.AWS_S3_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
      },
    });

    const file_key = `${chatbotId}/${Date.now().toString()}-${file.name.replace(
      /\s+/g,
      "-"
    )}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: file_key,
      Body: buffer,
    };

    await s3.putObject(params);

    return {
      file_key,
      file_name: file.name,
      chatbotId,
    };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}

export async function getS3Url(file_key: string) {
  const url = `${process.env.AWS_S3_ENDPOINT}/${file_key}`;
  return url;
}
