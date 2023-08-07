/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    compiler: {
        removeConsole: false,
    },
}

module.exports = nextConfig
