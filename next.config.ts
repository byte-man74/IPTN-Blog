import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '**',
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: '**',
      },
      {
        protocol: "https",
        hostname: "www.ipledge2nigeria.net",
        pathname: '**',
      },
    ],
  },
}

export default nextConfig
