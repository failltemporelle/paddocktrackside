import type { Driver, Constructor, Race, QualifyingResult, SprintResult } from '~/types/f1'

export const useJolpicaApi = () => {
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

  const fetchSeasonResults = async (year = currentYear) => {
    let offset = 0
    const limit = 100
    let allRaces: Race[] = []
    let total = 0

    do {
      try {
        const response = await fetch(`${config.public.apiBase}/${year}/results.json?limit=${limit}&offset=${offset}`)
        if (!response.ok) break

        const data = await response.json()
        const races = data.MRData.RaceTable?.Races || []

        // Handling potential race split across pages
        races.forEach((race: Race) => {
          const existingRace = allRaces.find(r => r.round === race.round)
          if (existingRace) {
            if (existingRace.Results && race.Results) {
              existingRace.Results.push(...race.Results)
            }
          } else {
            allRaces.push(race)
          }
        })

        total = parseInt(data.MRData.total || '0')
        offset += limit
      } catch (e) {
        console.error('Erreur fetching season results page:', e)
        break
      }
    } while (offset < total)

    return allRaces
  }

  return {
    fetchDriverStandings,
    fetchConstructorStandings,
    fetchRaces,
    fetchRaceResults,
    fetchQualifyingResults,
    fetchSprintResults,
    fetchSprintShootoutResults,
    fetchSeasonResults
  }
}