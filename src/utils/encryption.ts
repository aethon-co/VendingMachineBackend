import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;

function getKey(): Buffer {
    const key = process.env.QR_ENCRYPTION_KEY;
    if (!key) {
        throw new Error("QR_ENCRYPTION_KEY is not set in environment variables");
    }
    // Ensure key is exactly 32 bytes (256 bits)
    return crypto.createHash("sha256").update(key).digest();
}

export function encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
}

export function decrypt(encryptedText: string): string {
    const [ivHex, encrypted] = encryptedText.split(":");
    if (!ivHex || !encrypted) {
        throw new Error("Invalid encrypted text format");
    }
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
