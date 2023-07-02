/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'cdn.weatherapi.com',
            port: ''
        }]
    }
}

module.exports = nextConfig
