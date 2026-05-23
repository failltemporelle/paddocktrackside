// Supabase integration not active — @supabase/supabase-js is not installed.
export const useSupabase = () => {
  const fetchDriverStandings = async (): Promise<never[]> => []

  return {
    fetchDriverStandings
  }
}