import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb(env?: { TURSO_URL?: string; TURSO_AUTH_TOKEN?: string }) {
	if (_db) return _db;

	const url = env?.TURSO_URL ?? process.env.TURSO_URL ?? 'file:./local.db';
	const authToken = env?.TURSO_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN;

	const client = createClient({ url, authToken });
	_db = drizzle(client, { schema });
	return _db;
}

export type Db = ReturnType<typeof getDb>;
