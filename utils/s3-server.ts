import { S3 } from "@aws-sdk/client-s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function downloadFromS3(file_key: string): Promise<Buffer> {
  try {
    const s3 = new S3({
      region: process.env.AWS_S3_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
      },
    });
    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: file_key,
    };

    const obj = await s3.getObject(params);
    // Convert stream to buffer
    const buffer = await streamToBuffer(obj.Body as NodeJS.ReadableStream);
    return buffer;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Helper function to convert stream to buffer
async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

export async function deleteFromS3(fileKey: string) {
  try {
    const s3Client = new S3({
      region: process.env.AWS_S3_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
      },
    });

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: fileKey,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw error;
  }
}
