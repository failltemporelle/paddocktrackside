import type { MetaObject } from '@nuxt/schema'

export const useSeo = () => {
  const defaultMeta = {
    title: 'Paddock Track Side - Suivez la F1 en direct',
    description: 'Découvrez les derniers classements, statistiques et analyses de Formule 1. Restez connecté avec votre sport favori.',
    image: '/images/og-image.jpg',
    url: 'https://paddocktrackside.com'
  }

  const generateMeta = (meta: Partial<typeof defaultMeta> = {}): MetaObject => {
    const finalMeta = { ...defaultMeta, ...meta }
    
    return {
      title: finalMeta.title,
      meta: [
        { name: 'description', content: finalMeta.description },
        
        // Open Graph
        { property: 'og:title', content: finalMeta.title },
        { property: 'og:description', content: finalMeta.description },
        { property: 'og:image', content: finalMeta.image },
        { property: 'og:url', content: finalMeta.url },
        { property: 'og:type', content: 'website' },
        
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: finalMeta.title },
        { name: 'twitter:description', content: finalMeta.description },
        { name: 'twitter:image', content: finalMeta.image },
        
        // Additional SEO
        { name: 'robots', content: 'index, follow' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 'http-equiv': 'Content-Type', content: 'text/html; charset=utf-8' }
      ],
      link: [
        { rel: 'canonical', href: finalMeta.url }
      ]
    }
  }

  return {
    generateMeta
  }
}