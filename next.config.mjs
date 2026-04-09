/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/ai/seo-ljungby', destination: '/seo/ljungby', permanent: true },
      { source: '/ai/seo-helsingborg', destination: '/seo/helsingborg', permanent: true },
      { source: '/ai/seo-vaxjo', destination: '/seo/vaxjo', permanent: true },
      { source: '/seo/seo-halmstad', destination: '/seo/halmstad', permanent: true },
      { source: '/en/hemsida-markaryd', destination: '/hemsida/markaryd', permanent: true },
      { source: '/en/ny-hemsida-vaxjo', destination: '/hemsida/vaxjo', permanent: true },
      { source: '/en/google-ads-jonkoping', destination: '/google-ads/jonkoping', permanent: true },
      { source: '/google-ads-ljungby', destination: '/google-ads/ljungby', permanent: true },
      { source: '/google-ads-varnamo', destination: '/google-ads/varnamo', permanent: true },
      { source: '/kopia-på-digital-boost', destination: '/tjanster/grafisk-design', permanent: true },
      { source: '/digital-boost', destination: '/tjanster/digital-boost', permanent: true },
      { source: '/hemsida', destination: '/tjanster/webb', permanent: true },
      { source: '/seo', destination: '/tjanster/seo', permanent: true },
      { source: '/en/:path*', destination: '/', permanent: true },
    ]
  },
}

export default nextConfig
