// Données et calculs du comparateur de pilotes (/compare/drivers).
// Toutes les données viennent de l'API Jolpica/Ergast déjà utilisée par le site.
// Contrairement à useJolpicaApi (qui avale les erreurs et renvoie []), les
// fonctions d'ici LÈVENT une exception en cas d'échec, afin que la page puisse
// afficher un état d'erreur avec un bouton « Réessayer ».

export interface SeasonDriver {
  driverId: string
  givenName: string
  familyName: string
  code?: string
  permanentNumber?: string
  nationality?: string
}

/** Une manche de la saison vue du côté d'un pilote. */
export interface RoundEntry {
  round: number
  raceName: string
  qualifying: number | null // position en qualifications
  grid: number | null // position sur la grille de départ
  finish: number | null // position d'arrivée (null si non classé)
  positionText: string | null // "R", "D", "W"... quand non classé
  status: string | null
  racePoints: number
  sprintPoints: number
  fastestLap: boolean
}

export interface DriverSeason {
  driver: SeasonDriver
  team: string | null
  teamId: string | null
  championshipPosition: number | null
  points: number
  wins: number
  podiums: number
  poles: number
  fastestLaps: number
  races: number
  bestFinish: number | null
  avgFinish: number | null
  avgQualifying: number | null
  nonClassified: number
  pointsFinishes: number
  rounds: RoundEntry[]
}

type Json = any

export const useDriverComparison = () => {
  const config = useRuntimeConfig()
  const base = config.public.apiBase as string

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  // Rate-limit de l'API : on retente les 429 et les erreurs réseau avec un
  // délai croissant (temporisation technique, aucune donnée simulée).
  const fetchJson = async (path: string, retries = 3): Promise<Json> => {
    let lastError: unknown = null
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${base}/${path}`)
        if (response.ok) return await response.json()
        lastError = new Error(`HTTP ${response.status} : ${path}`)
        if (response.status !== 429 && response.status < 500) break
      } catch (error) {
        lastError = error
      }
      if (attempt < retries) await wait(400 * (attempt + 1))
    }
    throw lastError
  }

  const toNumber = (value: unknown): number | null => {
    const n = parseInt(String(value), 10)
    return Number.isFinite(n) ? n : null
  }

  /** Pilotes ayant pris part à la saison, triés par nom de famille. */
  const fetchSeasonDrivers = async (year: number): Promise<SeasonDriver[]> => {
    const data = await fetchJson(`${year}/drivers.json?limit=100`)
    const drivers: SeasonDriver[] = data?.MRData?.DriverTable?.Drivers ?? []
    return [...drivers].sort((a, b) => a.familyName.localeCompare(b.familyName, 'fr'))
  }

  /** Classement pilotes de la saison (peut être vide si la saison n'a pas commencé). */
  const fetchStandings = async (year: number): Promise<Json[]> => {
    const data = await fetchJson(`${year}/driverStandings.json?limit=100`)
    return data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? []
  }

  /** Résultats course, qualifications et sprint d'un pilote sur une saison. */
  const fetchDriverRaw = async (year: number, driverId: string) => {
    // Séquentiel volontairement : on reste sous le rate-limit de l'API.
    const race = await fetchJson(`${year}/drivers/${driverId}/results.json?limit=100`)
    const quali = await fetchJson(`${year}/drivers/${driverId}/qualifying.json?limit=100`)
    const sprint = await fetchJson(`${year}/drivers/${driverId}/sprint.json?limit=100`)
    return {
      raceRaces: (race?.MRData?.RaceTable?.Races ?? []) as Json[],
      qualiRaces: (quali?.MRData?.RaceTable?.Races ?? []) as Json[],
      sprintRaces: (sprint?.MRData?.RaceTable?.Races ?? []) as Json[]
    }
  }

  const average = (values: number[]): number | null =>
    values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10 : null

  /** Assemble les statistiques d'un pilote pour la saison. */
  const buildDriverSeason = (
    driver: SeasonDriver,
    raw: Awaited<ReturnType<typeof fetchDriverRaw>>,
    standing: Json | undefined
  ): DriverSeason => {
    const byRound = new Map<number, RoundEntry>()
    const entry = (round: number, raceName: string): RoundEntry => {
      let current = byRound.get(round)
      if (!current) {
        current = {
          round, raceName, qualifying: null, grid: null, finish: null, positionText: null,
          status: null, racePoints: 0, sprintPoints: 0, fastestLap: false
        }
        byRound.set(round, current)
      }
      return current
    }

    let lastConstructor: Json | null = null

    for (const race of raw.raceRaces) {
      const result = race.Results?.[0]
      if (!result) continue
      const e = entry(parseInt(race.round, 10), race.raceName)
      const finish = toNumber(result.position)
      const isNumeric = /^\d+$/.test(String(result.positionText ?? ''))
      e.finish = isNumeric ? finish : null
      e.positionText = isNumeric ? null : String(result.positionText ?? '')
      e.status = result.status ?? null
      const grid = toNumber(result.grid)
      e.grid = grid && grid > 0 ? grid : null // 0 = départ des stands
      e.racePoints = parseFloat(result.points) || 0
      e.fastestLap = result.FastestLap?.rank === '1'
      lastConstructor = result.Constructor ?? lastConstructor
    }

    for (const race of raw.qualiRaces) {
      const result = race.QualifyingResults?.[0]
      if (!result) continue
      entry(parseInt(race.round, 10), race.raceName).qualifying = toNumber(result.position)
    }

    for (const race of raw.sprintRaces) {
      const result = race.SprintResults?.[0]
      if (!result) continue
      entry(parseInt(race.round, 10), race.raceName).sprintPoints = parseFloat(result.points) || 0
    }

    const rounds = [...byRound.values()].sort((a, b) => a.round - b.round)
    // Une manche n'est comptée « disputée » que si un résultat de course existe
    const raced = rounds.filter(r => r.finish !== null || r.positionText !== null)
    const finishes = raced.map(r => r.finish).filter((p): p is number => p !== null)
    const qualis = rounds.map(r => r.qualifying).filter((p): p is number => p !== null)
    const computedPoints = rounds.reduce((sum, r) => sum + r.racePoints + r.sprintPoints, 0)

    const standingConstructor = standing?.Constructors?.[standing.Constructors.length - 1] ?? lastConstructor

    return {
      driver,
      team: standingConstructor?.name ?? null,
      teamId: standingConstructor?.constructorId ?? null,
      championshipPosition: standing ? toNumber(standing.position) : null,
      // Le classement officiel fait foi ; à défaut on cumule les points des résultats
      points: standing ? parseFloat(standing.points) || 0 : computedPoints,
      wins: standing ? toNumber(standing.wins) ?? 0 : finishes.filter(p => p === 1).length,
      podiums: finishes.filter(p => p <= 3).length,
      poles: qualis.filter(p => p === 1).length,
      fastestLaps: raced.filter(r => r.fastestLap).length,
      races: raced.length,
      bestFinish: finishes.length ? Math.min(...finishes) : null,
      avgFinish: average(finishes),
      avgQualifying: average(qualis),
      nonClassified: raced.filter(r => r.finish === null).length,
      pointsFinishes: raced.filter(r => r.racePoints > 0).length,
      rounds
    }
  }

  /**
   * Charge et assemble la comparaison de deux pilotes sur une saison.
   * Lève une exception si l'une des requêtes échoue.
   */
  const fetchComparison = async (
    year: number,
    first: SeasonDriver,
    second: SeasonDriver
  ): Promise<[DriverSeason, DriverSeason]> => {
    const standings = await fetchStandings(year)
    const rawFirst = await fetchDriverRaw(year, first.driverId)
    const rawSecond = await fetchDriverRaw(year, second.driverId)
    const find = (id: string) => standings.find(s => s.Driver?.driverId === id)
    return [
      buildDriverSeason(first, rawFirst, find(first.driverId)),
      buildDriverSeason(second, rawSecond, find(second.driverId))
    ]
  }

  return {
    fetchSeasonDrivers,
    fetchComparison
  }
}
