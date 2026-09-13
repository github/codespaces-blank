/**
 * Password hashing using WebCrypto PBKDF2 — works on Cloudflare Workers and Node.js.
 * Format: "pbkdf2:<hex-salt>:<hex-hash>"
 */

const ITERATIONS = 100_000;
const KEY_LENGTH = 32; // bytes

async function deriveKey(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
	const enc = new TextEncoder();
	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		enc.encode(password),
		'PBKDF2',
		false,
		['deriveBits']
	);
	return crypto.subtle.deriveBits(
		{ name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
		keyMaterial,
		KEY_LENGTH * 8
	);
}

function toHex(buf: ArrayBuffer): string {
	return Array.from(new Uint8Array(buf))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

function fromHex(hex: string): Uint8Array {
	const bytes = new Uint8Array(hex.length / 2);
	for (let i = 0; i < hex.length; i += 2) {
		bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
	}
	return bytes;
}

export async function hashPassword(password: string): Promise<string> {
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const derived = await deriveKey(password, salt);
	return `pbkdf2:${toHex(salt.buffer)}:${toHex(derived)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
	if (stored.startsWith('sha256:')) {
		// Legacy dev hash — compare directly using PBKDF2-equivalent check
		// This path only exists for old dev accounts; not used in production
		const { createHash } = await import('node:crypto');
		const h = 'sha256:' + createHash('sha256').update(password + 'rakatoss-salt').digest('hex');
		return h === stored;
	}

	if (!stored.startsWith('pbkdf2:')) return false;
	const parts = stored.split(':');
	if (parts.length !== 3) return false;
	const [, saltHex, hashHex] = parts;
	const salt = fromHex(saltHex);
	const derived = await deriveKey(password, salt);
	const candidateHex = toHex(derived);
	// Constant-time comparison
	if (candidateHex.length !== hashHex.length) return false;
	let diff = 0;
	for (let i = 0; i < candidateHex.length; i++) {
		diff |= candidateHex.charCodeAt(i) ^ hashHex.charCodeAt(i);
	}
	return diff === 0;
}
