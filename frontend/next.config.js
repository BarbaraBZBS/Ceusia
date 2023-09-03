/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    compiler: {
        removeConsole: false,
    },
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'http',
                hostname: "localhost",
                port: "8000",
                pathname: "/**",
            },
        ],
    },
}

module.exports = nextConfig
