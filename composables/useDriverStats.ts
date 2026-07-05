import type { Driver } from '~/types/f1'

const isClassifiedFinish = (status: string) => status === 'Finished' || /^\+\d+\s?Laps?$/.test(status)

export const useDriverStats = () => {
  const config = useRuntimeConfig()

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  // L'API jolpica applique un rate-limit strict : des requêtes en rafale se
  // prennent des 429, voire des erreurs réseau brutes (connexion refusée).
  // On fetch donc en séquentiel, avec un léger espacement, et on retente
  // aussi bien les 429 que les erreurs réseau pour ne perdre aucune saison.
  const fetchWithRetry = async (url: string, retries = 5): Promise<Response> => {
    let lastError: unknown = null
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url)
        if (response.ok || response.status !== 429) return response
        lastError = new Error(`HTTP 429: ${url}`)
      } catch (error) {
        lastError = error
      }
      await wait(250 * (attempt + 1))
    }
    throw lastError
  }

  // Récupère toutes les pages d'un endpoint de type RaceTable (limit/offset)
  const fetchAllRaces = async (path: string, limit = 100) => {
    const races: any[] = []
    let offset = 0
    let total = Infinity
    while (offset < total) {
      const response = await fetchWithRetry(`${config.public.apiBase}${path}?limit=${limit}&offset=${offset}`)
      if (!response.ok) break
      const data = await response.json()
      total = parseInt(data.MRData.total || '0', 10)
      const pageRaces = data.MRData.RaceTable?.Races || []
      races.push(...pageRaces)
      if (!pageRaces.length) break
      offset += limit
      if (offset < total) await wait(120)
    }
    return races
  }

  const getDriverHistory = async (driverId: string) => {
    const currentYear = new Date().getFullYear()
    const startYear = 2000 // On commence à partir de 2000 pour limiter les données
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i)

    const results: any[] = []
    for (const year of years) {
      try {
        const response = await fetchWithRetry(`${config.public.apiBase}/${year}/drivers/${driverId}/driverStandings.json`)
        if (!response.ok) {
          results.push(null)
          continue
        }
        const data = await response.json()
        results.push(data.MRData.StandingsTable?.StandingsLists[0]?.DriverStandings[0] || null)
      } catch (error) {
        console.error(`Erreur pour l'année ${year}:`, error)
        results.push(null)
      }
      await wait(120)
    }

    return years
      .map((year, index) => {
        const result = results[index]
        if (!result) return null

        return {
          year,
          points: Number(result.points || 0),
          position: Number(result.position || 0),
          wins: Number(result.wins || 0),
          team: (result.Constructors || []).map((c: any) => c.name).join(' / ') || null,
          teamId: result.Constructors?.[0]?.constructorId || null,
          Driver: result.Driver
        }
      })
      .filter((result): result is NonNullable<typeof result> => result !== null && result.points > 0)
  }

  const getDriverProfile = async (driverId: string) => {
    try {
      const response = await fetchWithRetry(`${config.public.apiBase}/drivers/${driverId}.json`)
      if (!response.ok) return null
      const data = await response.json()
      return data.MRData.DriverTable?.Drivers?.[0] || null
    } catch (error) {
      console.error(`Erreur lors de la récupération du profil pour ${driverId}:`, error)
      return null
    }
  }

  // Agrège l'intégralité de la carrière (courses + qualifications) pour
  // calculer les stats indisponibles dans driverStandings (podiums, poles,
  // meilleurs tours, DNF, grille/arrivée moyennes...), globalement et par saison.
  const getDriverCareerStats = async (driverId: string) => {
    try {
      const [resultRaces, qualifyingRaces] = [
        await fetchAllRaces(`/drivers/${driverId}/results.json`),
        await fetchAllRaces(`/drivers/${driverId}/qualifying.json`)
      ]

      const polesBySeason = new Map<number, number>()
      let totalPoles = 0
      qualifyingRaces.forEach(race => {
        const q = race.QualifyingResults?.[0]
        if (q?.position === '1') {
          const year = Number(race.season)
          polesBySeason.set(year, (polesBySeason.get(year) || 0) + 1)
          totalPoles++
        }
      })

      type SeasonAgg = {
        races: number; podiums: number; fastestLaps: number; dnf: number
        finishesInPoints: number; gridSum: number; gridCount: number
        finishSum: number; finishCount: number
      }
      const bySeason = new Map<number, SeasonAgg>()
      const totals: SeasonAgg = { races: 0, podiums: 0, fastestLaps: 0, dnf: 0, finishesInPoints: 0, gridSum: 0, gridCount: 0, finishSum: 0, finishCount: 0 }

      resultRaces.forEach(race => {
        const result = race.Results?.[0]
        if (!result) return
        const year = Number(race.season)
        const entry = bySeason.get(year) || { races: 0, podiums: 0, fastestLaps: 0, dnf: 0, finishesInPoints: 0, gridSum: 0, gridCount: 0, finishSum: 0, finishCount: 0 }

        const position = Number(result.position)
        const grid = Number(result.grid)
        const points = Number(result.points || 0)
        const classified = isClassifiedFinish(result.status)

        entry.races++
        totals.races++

        if (Number.isFinite(position) && position <= 3) { entry.podiums++; totals.podiums++ }
        if (result.FastestLap?.rank === '1') { entry.fastestLaps++; totals.fastestLaps++ }
        if (!classified) { entry.dnf++; totals.dnf++ }
        if (points > 0) { entry.finishesInPoints++; totals.finishesInPoints++ }
        if (Number.isFinite(grid)) { entry.gridSum += grid; entry.gridCount++; totals.gridSum += grid; totals.gridCount++ }
        if (Number.isFinite(position)) { entry.finishSum += position; entry.finishCount++; totals.finishSum += position; totals.finishCount++ }

        bySeason.set(year, entry)
      })

      const round1 = (n: number) => Math.round(n * 10) / 10
      const bySeasonStats: Record<number, { races: number; podiums: number; poles: number; fastestLaps: number; dnf: number; finishesInPoints: number; avgGrid: number | null; avgFinish: number | null }> = {}
      bySeason.forEach((v, year) => {
        bySeasonStats[year] = {
          races: v.races,
          podiums: v.podiums,
          poles: polesBySeason.get(year) || 0,
          fastestLaps: v.fastestLaps,
          dnf: v.dnf,
          finishesInPoints: v.finishesInPoints,
          avgGrid: v.gridCount ? round1(v.gridSum / v.gridCount) : null,
          avgFinish: v.finishCount ? round1(v.finishSum / v.finishCount) : null
        }
      })

      return {
        starts: totals.races,
        podiums: totals.podiums,
        poles: totalPoles,
        fastestLaps: totals.fastestLaps,
        dnf: totals.dnf,
        finishesInPoints: totals.finishesInPoints,
        avgGrid: totals.gridCount ? round1(totals.gridSum / totals.gridCount) : null,
        avgFinish: totals.finishCount ? round1(totals.finishSum / totals.finishCount) : null,
        bySeason: bySeasonStats
      }
    } catch (error) {
      console.error(`Erreur lors du calcul des stats de carrière pour ${driverId}:`, error)
      return null
    }
  }

  return {
    getDriverHistory,
    getDriverProfile,
    getDriverCareerStats
  }
}
