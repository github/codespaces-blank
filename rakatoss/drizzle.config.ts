import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/db/schema.ts',
	out: './drizzle/migrations',
	dialect: 'sqlite',
	dbCredentials: {
		url: process.env.TURSO_URL ?? 'file:./local.db',
		authToken: process.env.TURSO_AUTH_TOKEN
	}
});
