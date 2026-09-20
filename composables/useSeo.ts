import type { MetaObject } from '@nuxt/schema'

interface SeoOptions {
  title: string
  description: string
  image: string
  /** Chemin de la page (ex. /standings). Par défaut : la route courante. */
  path: string
  /** noindex pour les pages qui ne doivent pas être référencées */
  noindex: boolean
}

export const useSeo = () => {
  const config = useRuntimeConfig()
  const route = useRoute()
  const siteUrl = String(config.public.siteUrl).replace(/\/$/, '')

  const defaultMeta = {
    title: 'Paddock Track Side | Classements, calendrier et statistiques F1',
    description: 'Suivez la Formule 1 : classements pilotes et constructeurs, calendrier, résultats de Grands Prix, statistiques, records et comparateur de pilotes.',
    image: '/images/og-image.jpg'
  }

  const generateMeta = (meta: Partial<SeoOptions> = {}): MetaObject => {
    const finalMeta = { ...defaultMeta, noindex: false, ...meta }
    // Chemin sans paramètres de requête : une seule URL canonique par page
    const path = finalMeta.path ?? route.path
    const url = `${siteUrl}${path === '/' ? '/' : path.replace(/\/$/, '')}`
    const image = finalMeta.image.startsWith('http') ? finalMeta.image : `${siteUrl}${finalMeta.image}`

    return {
      title: finalMeta.title,
      meta: [
        { name: 'description', content: finalMeta.description },

        // Open Graph
        { property: 'og:title', content: finalMeta.title },
        { property: 'og:description', content: finalMeta.description },
        { property: 'og:image', content: image },
        { property: 'og:url', content: url },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Paddock Track Side' },
        { property: 'og:locale', content: 'fr_FR' },

        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: finalMeta.title },
        { name: 'twitter:description', content: finalMeta.description },
        { name: 'twitter:image', content: image },

        { name: 'robots', content: finalMeta.noindex ? 'noindex, follow' : 'index, follow' }
      ],
      link: [
        { rel: 'canonical', href: url }
      ]
    }
  }

  return {
    generateMeta
  }
}
