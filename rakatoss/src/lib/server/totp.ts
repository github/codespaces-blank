import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-cbc';

function getKey(): Buffer {
	const key = process.env.TOTP_ENCRYPTION_KEY ?? '';
	return Buffer.from(key, 'base64').subarray(0, 32);
}

export function encryptSecret(secret: string): string {
	const key = getKey();
	const iv = randomBytes(16);
	const cipher = createCipheriv(ALGORITHM, key, iv);
	const encrypted = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
	return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decryptSecret(stored: string): string {
	const [ivHex, encHex] = stored.split(':');
	const key = getKey();
	const iv = Buffer.from(ivHex, 'hex');
	const enc = Buffer.from(encHex, 'hex');
	const decipher = createDecipheriv(ALGORITHM, key, iv);
	return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');
}
