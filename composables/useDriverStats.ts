import type { Driver } from '~/types/f1'

export const useDriverStats = () => {
  const config = useRuntimeConfig()

  const getDriverHistory = async (driverId: string) => {
    const currentYear = new Date().getFullYear()
    const startYear = 2000 // On commence à partir de 2000 pour limiter les données
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i)
    
    const results = await Promise.all(
      years.map(async year => {
        try {
          const response = await fetch(`${config.public.apiBase}/${year}/drivers/${driverId}/driverStandings.json`)
          if (!response.ok) return null
          const data = await response.json()
          return data.MRData.StandingsTable?.StandingsLists[0]?.DriverStandings[0] || null
        } catch (error) {
          console.error(`Erreur pour l'année ${year}:`, error)
          return null
        }
      })
    )

    return years
      .map((year, index) => {
        const result = results[index]
        if (!result) return null
        
        return {
          year,
          points: Number(result.points || 0),
          position: Number(result.position || 0),
          wins: Number(result.wins || 0),
          Driver: result.Driver
        }
      })
      .filter((result): result is NonNullable<typeof result> => result !== null && result.points > 0)
  }

  return {
    getDriverHistory
  }
}