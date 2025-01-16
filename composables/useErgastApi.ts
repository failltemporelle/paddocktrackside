import type { Driver, Constructor, Race, QualifyingResult, SprintResult } from '~/types/f1'

export const useErgastApi = () => {
  const config = useRuntimeConfig()
  const currentYear = new Date().getFullYear()

  const fetchData = async <T>(endpoint: string, ignoreErrors = false): Promise<T[]> => {
    try {
      const response = await fetch(`${config.public.apiBase}/${endpoint}`)
      if (!response.ok && ignoreErrors) {
        return []
      }
      const data = await response.json()
      return data.MRData.RaceTable?.Races || 
             data.MRData.StandingsTable?.StandingsLists[0]?.DriverStandings || 
             data.MRData.StandingsTable?.StandingsLists[0]?.ConstructorStandings || 
             []
    } catch (error) {
      if (!ignoreErrors) {
        console.error(`Erreur lors de la récupération des données: ${endpoint}`, error)
      }
      return []
    }
  }

  const fetchDriverStandings = (year = currentYear) => {
    return fetchData<Driver>(`${year}/driverStandings.json`)
  }

  const fetchConstructorStandings = (year = currentYear) => {
    return fetchData<Constructor>(`${year}/constructorStandings.json`)
  }

  const fetchRaces = (year = currentYear) => {
    return fetchData<Race>(`${year}.json`)
  }

  const fetchRaceResults = (year: string, round: string) => {
    return fetchData<Race>(`${year}/${round}/results.json`)
  }

  const fetchQualifyingResults = (year: string, round: string) => {
    return fetchData<Race>(`${year}/${round}/qualifying.json`)
  }

  const fetchSprintResults = (year: string, round: string) => {
    return fetchData<Race>(`${year}/${round}/sprint.json`, true)
  }

  const fetchSprintShootoutResults = (year: string, round: string) => {
    return fetchData<Race>(`${year}/${round}/sprint-shootout.json`, true)
  }

  return {
    fetchDriverStandings,
    fetchConstructorStandings,
    fetchRaces,
    fetchRaceResults,
    fetchQualifyingResults,
    fetchSprintResults,
    fetchSprintShootoutResults
  }
}