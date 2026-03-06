import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Ensure required environment variables are present or fall back gracefully
const s3Client = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

export const uploadImageToS3 = async (file: File): Promise<string> => {
    if (!process.env.AWS_S3_BUCKET_NAME || !process.env.AWS_ACCESS_KEY_ID) {
        throw new Error("AWS S3 is not configured. Missing credentials in backend .env");
    }

    // Generate a unique filename
    const extension = file.type.split('/')[1] || 'jpeg';
    const fileName = `vending-products/${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: file.type || "image/jpeg",
    });

    await s3Client.send(command);

    // Return the public URL
    // If using standard AWS S3:
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileName}`;
};
