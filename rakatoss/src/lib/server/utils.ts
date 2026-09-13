import { customAlphabet } from 'nanoid/non-secure';

const alpha = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 21);
const refAlpha = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);
const shortAlpha = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 8);

export const nanoid = () => alpha();
export const genReferralCode = () => refAlpha();
export const genRef = () => shortAlpha();

export function genUUID(): string {
	// Simple UUID v4 without crypto.randomUUID (works on all environments)
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = Math.floor(Math.random() * 16);
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export function formatCoins(n: number): string {
	return Math.floor(n).toLocaleString('en-IN');
}

export function slugify(s: string): string {
	return s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}
