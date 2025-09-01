import { computed } from 'vue'

export const useConstructorImages = () => {
  const getConstructorImage = (constructorId: string) => {
    const constructorImages: Record<string, string> = {
      'red_bull': 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/red-bull-racing.png.transform/4col/image.png',
      'ferrari': 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/ferrari.png.transform/4col/image.png',
      'mercedes': 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/mercedes.png.transform/4col/image.png',
      'mclaren': 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/mclaren.png.transform/4col/image.png',
      'aston_martin': 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/aston-martin.png.transform/4col/image.png',
      'alpine': 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/alpine.png.transform/4col/image.png',
      'williams': 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/williams.png.transform/4col/image.png',
      'rb': 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/rb.png',
      'sauber': 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/kick-sauber.png',
      'haas': 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/haas.png'
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