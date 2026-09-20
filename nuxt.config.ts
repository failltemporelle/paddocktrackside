export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-vercel-analytics'],
  css: ['~/assets/css/main.css'],
  ssr: false, // SPA : les données sont chargées côté client depuis l'API Jolpica
  runtimeConfig: {
    public: {
      siteUrl: 'https://paddocktrackside.vercel.app', // à changer si un domaine personnalisé est branché
      apiBase: 'https://api.jolpi.ca/ergast/f1',
      supabaseUrl: 'https://gzgxdrlwjjuuwetorpqv.supabase.co',
      supabaseAnonKey: 'sb_publishable_KVZaERkvHZPWHw7ok97vnQ_id80dRm9'
    }
  },
  // /dashboard faisait doublon avec /stats : redirection permanente
  routeRules: {
    '/dashboard': { redirect: { to: '/stats', statusCode: 301 } }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'fr'
      },
      title: 'Paddock Track Side | Classements, calendrier et statistiques F1',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#E10600' },
        // Valeurs par défaut lisibles sans JavaScript (aperçus de partage, robots).
        // Chaque page les remplace ensuite via useSeo().
        { name: 'description', content: 'Suivez la Formule 1 : classements pilotes et constructeurs, calendrier, résultats de Grands Prix, statistiques, records et comparateur de pilotes.' },
        { property: 'og:site_name', content: 'Paddock Track Side' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Paddock Track Side | Classements, calendrier et statistiques F1' },
        { property: 'og:description', content: 'Suivez la Formule 1 : classements, calendrier, résultats, statistiques, records et comparateur de pilotes.' },
        { property: 'og:image', content: 'https://paddocktrackside.vercel.app/images/og-image.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://paddocktrackside.vercel.app/images/og-image.jpg' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
      ]
    }
  }
})