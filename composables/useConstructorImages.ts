import { computed } from 'vue'

export const useConstructorImages = () => {
  const getConstructorImage = (constructorId: string) => {
    const BASE = 'https://media.formula1.com/image/upload/c_limit,h_224/q_auto/d_common:f1:2026:fallback:car:2026fallbackcarright.webp/v1740000001/common/f1/2026'
    const constructorImages: Record<string, string> = {
      'red_bull':     `${BASE}/redbullracing/2026redbullracingcarright.webp`,
      'ferrari':      `${BASE}/ferrari/2026ferraricarright.webp`,
      'mercedes':     `${BASE}/mercedes/2026mercedescarright.webp`,
      'mclaren':      `${BASE}/mclaren/2026mclarencarright.webp`,
      'aston_martin': `${BASE}/astonmartin/2026astonmartincarright.webp`,
      'alpine':       `${BASE}/alpine/2026alpinecarright.webp`,
      'williams':     `${BASE}/williams/2026williamscarright.webp`,
      'rb':           `${BASE}/racingbulls/2026racingbullscarright.webp`,
      'racing_bulls': `${BASE}/racingbulls/2026racingbullscarright.webp`,
      'sauber':       `${BASE}/audi/2026audicarright.webp`,
      'audi':         `${BASE}/audi/2026audicarright.webp`,
      'haas':         `${BASE}/haasf1team/2026haasf1teamcarright.webp`,
      'cadillac':     `${BASE}/cadillac/2026cadillaccarright.webp`,
    }

    const normalizedId = constructorId.toLowerCase().replace(/[^a-z0-9_]/g, '')

    // Recherche stricte de l'image avec l'ID normalisé
    const imageUrl = Object.entries(constructorImages).find(([key]) => 
      key.toLowerCase() === normalizedId
    )?.[1]
    
    // Retourne l'URL trouvée ou un placeholder par défaut
    return computed(() => imageUrl || '/images/constructor-placeholder.png')
  }

  return {
    getConstructorImage
  }
}