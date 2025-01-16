import { createClient } from '@supabase/supabase-js'

export const useSupabase = () => {
  const config = useRuntimeConfig()
  
  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey
  )

  const fetchDriverStandings = async () => {
    try {
      const { data, error } = await supabase
        .from('standing')
        .select('*')
        .order('position', { ascending: true })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération des classements pilotes:', error)
      return []
    }
  }

  return {
    fetchDriverStandings
  }
}