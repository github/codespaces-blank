/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: {
			allowedForwardedHosts: ['localhost', 'http://ideal-goldfish-464rwpwr5743jgvj-3000.app.github.dev'],
			allowedOrigins: ['http://localhost', 'http://ideal-goldfish-464rwpwr5743jgvj-3000.app.github.dev']
		},
	}
};

export default nextConfig;
