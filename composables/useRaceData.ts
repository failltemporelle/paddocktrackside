import type { Race } from '~/types/f1'

export const useRaceData = () => {
  const config = useRuntimeConfig()
  
  const fetchCurrentSeasonRaces = async () => {
    try {
      const response = await fetch(`${config.public.apiBase}/current.json`)
      const data = await response.json()
      return data.MRData.RaceTable?.Races || []
    } catch (error) {
      console.error('Error fetching current season races:', error)
      return []
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    if (!time) return 'Heure à confirmer'
    return new Date(`2024-01-01T${time}`).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return {
    fetchCurrentSeasonRaces,
    formatDate,
    formatTime
  }
}