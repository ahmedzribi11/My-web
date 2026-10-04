// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

/**
 * URL publique du site (balises canoniques, Open Graph, sitemap, QR codes).
 * Ordre : SITE_URL (domaine définitif, ex. https://www.gcg-ci.com) → domaine
 * de production Vercel (fourni automatiquement au build) → aucune.
 */
const site =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined)

export default defineConfig({
  site,
  trailingSlash: 'never',
  build: { format: 'directory' },
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    react(),
    ...(site
      ? [
          sitemap({
            filter: (page) => !/\/(admin|partager\/affiche|en\/share\/poster)/.test(page),
            i18n: { defaultLocale: 'fr', locales: { fr: 'fr-CI', en: 'en' } },
          }),
        ]
      : []),
  ],
  image: {
    responsiveStyles: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
