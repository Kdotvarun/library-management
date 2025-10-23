/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXTAUTH_URL || 'https://yourdomain.com',
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/api/*', '/signin', '/unauthorized'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/signin', '/unauthorized'],
      },
    ],
  },
}
