import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/products/frido-orthotics-posture-corrector',
        permanent: false,
      },
      {
        source: '/products',
        destination: '/products/frido-orthotics-posture-corrector',
        permanent: false,
      },
      {
        source: '/about',
        destination: '/products/frido-orthotics-posture-corrector',
        permanent: false,
      },
      {
        source: '/contact',
        destination: '/products/frido-orthotics-posture-corrector',
        permanent: false,
      },
      {
        source: '/help',
        destination: '/products/frido-orthotics-posture-corrector',
        permanent: false,
      },
      {
        source: '/shipping',
        destination: '/products/frido-orthotics-posture-corrector',
        permanent: false,
      },
      {
        source: '/returns',
        destination: '/products/frido-orthotics-posture-corrector',
        permanent: false,
      },
      {
        source: '/size-guide',
        destination: '/products/frido-orthotics-posture-corrector',
        permanent: false,
      },
      {
        source: '/careers',
        destination: '/products/frido-orthotics-posture-corrector',
        permanent: false,
      },
      {
        source: '/press',
        destination: '/products/frido-orthotics-posture-corrector',
        permanent: false,
      },
      {
        source: '/blog',
        destination: '/products/frido-orthotics-posture-corrector',
        permanent: false,
      },
      {
        source: '/privacy',
        destination: '/products/frido-orthotics-posture-corrector',
        permanent: false,
      },
      {
        source: '/terms',
        destination: '/products/frido-orthotics-posture-corrector',
        permanent: false,
      },
      {
        source: '/cookies',
        destination: '/products/frido-orthotics-posture-corrector',
        permanent: false,
      },
      {
        source: '/accessibility',
        destination: '/products/frido-orthotics-posture-corrector',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
