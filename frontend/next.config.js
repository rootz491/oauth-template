/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	async rewrites() {
		return [
			{
				source: "/v1/:path*",
				destination: "http://localhost:8000/v1/:path*", // Proxy to Backend
			},
		];
	},
};

module.exports = nextConfig;
