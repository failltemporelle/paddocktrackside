import { driverImageMap } from '~/utils/driverImages'

export const useDriverImages = () => {
  const getDriverImage = (driverId: string) => {
    if (!driverId) return '/images/driver-placeholder.jpg'
    
    // Normalisation de l'ID du pilote pour la recherche
    const normalizedId = driverId.toLowerCase().replace(/[^a-z0-9_]/g, '')

    // Recherche de l'image avec l'ID normalisé
    const imageUrl = Object.entries(driverImageMap).find(([key]) => 
      key.toLowerCase() === normalizedId
    )?.[1]
    
    return imageUrl || '/images/driver-placeholder.jpg'
  }

  return {
    getDriverImage
  }
}