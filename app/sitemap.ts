import type { MetadataRoute } from 'next'

const baseUrl = 'https://jtmediasweden.com'

const cities = [
  'ljungby',
  'varnamo',
  'vaxjo',
  'markaryd',
  'halmstad',
  'helsingborg',
  'jonkoping',
  'almhult',
  'lagan',
  'lessebo',
]

const caseslugs = [
  'ams-sweden',
  'hards-transport',
  'ljungby-fiber',
  'molico',
  'pekuma',
  'smefast',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/tjanster`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/tjanster/webb`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/tjanster/ai`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/tjanster/seo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/tjanster/google-ads`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/tjanster/sociala-medier`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/tjanster/digital-boost`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/tjanster/grafisk-design`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/kundcase`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/om-oss`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/kontakt`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/seo-test`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/villkor`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  const casePages: MetadataRoute.Sitemap = caseslugs.map((slug) => ({
    url: `${baseUrl}/kundcase/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const hemsidaPages: MetadataRoute.Sitemap = cities.map((stad) => ({
    url: `${baseUrl}/hemsida/${stad}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.65,
  }))

  const seoPages: MetadataRoute.Sitemap = cities.map((stad) => ({
    url: `${baseUrl}/seo/${stad}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.65,
  }))

  const googleAdsPages: MetadataRoute.Sitemap = cities.map((stad) => ({
    url: `${baseUrl}/google-ads/${stad}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.65,
  }))

  return [
    ...staticPages,
    ...casePages,
    ...hemsidaPages,
    ...seoPages,
    ...googleAdsPages,
  ]
}
