/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // 这时google的图片
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.daisyui.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'candy.ai',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.candy.ai',
        port: '',
        pathname: '/**',
      },
      
      {
        protocol: 'https',
        hostname: 'aitexttovideo.obs.cn-north-4.myhuaweicloud.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig