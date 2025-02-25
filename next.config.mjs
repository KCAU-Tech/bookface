/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/**',
      },
      // For demo only. Not for production
      {
        protocol: 'https',
        hostname: 'static1.makeuseofimages.com',
        port: '',
        pathname: '/wordpress/wp-content/uploads/2022/01/DIY-Workspace-unsplash.jpg',
      }
    ],
  },
};

export default nextConfig;
