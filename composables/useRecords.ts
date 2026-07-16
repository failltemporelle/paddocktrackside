import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export const useSupabaseClient = () => {
  const config = useRuntimeConfig()
  if (!client) {
    client = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey)
  }
  return client
}

export interface RecordCatalogItem {
  slug: string
  category: 'driver' | 'constructor'
  title: string
  description: string
  unit: string
  keywords: string[]
}

export interface RecordLeaderboardRow {
  entity_id: string
  entity_name: string
  value: number
  extra: string | null
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

const STOPWORDS = new Set(['record', 'records', 'nombre', 'de', 'du', 'des', 'le', 'la', 'les', 'un', 'une', 'plus', 'en', 'quel', 'quelle', 'qui', 'est', 'ce', 'cette', 'avec', 'pour', 'combien'])

export const useRecords = () => {
  const supabase = useSupabaseClient()

  const fetchCatalog = async (): Promise<RecordCatalogItem[]> => {
    const { data, error } = await supabase.from('records_catalog').select('*')
    if (error) throw error
    return (data || []) as RecordCatalogItem[]
  }

  const searchCatalog = (catalog: RecordCatalogItem[], query: string): RecordCatalogItem[] => {
    const q = normalize(query)
    if (!q) return []
    const allTerms = q.split(/\s+/).filter(Boolean)
    const terms = allTerms.filter(t => !STOPWORDS.has(t))
    if (!terms.length) return []

    return catalog
      .map(item => {
        const titleHaystack = normalize(item.title)
        const fullHaystack = normalize([item.title, item.description, ...(item.keywords || [])].join(' '))
        let score = 0
        let allInTitle = true
        for (const term of terms) {
          if (titleHaystack.includes(term)) {
            score += 10
          } else if (fullHaystack.includes(term)) {
            score += 2
            allInTitle = false
          } else {
            allInTitle = false
          }
        }
        if (allInTitle) score += 15
        return { item, score }
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.item)
  }

  const getLeaderboard = async (slug: string, limit = 10): Promise<RecordLeaderboardRow[]> => {
    const { data, error } = await supabase.rpc('get_record_leaderboard', { p_slug: slug, p_limit: limit })
    if (error) throw error
    return (data || []) as RecordLeaderboardRow[]
  }

  return { fetchCatalog, searchCatalog, getLeaderboard }
}
