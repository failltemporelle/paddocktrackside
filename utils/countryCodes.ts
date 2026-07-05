export const countryCodeMap: Record<string, string> = {
  'British': 'gb',
  'Dutch': 'nl',
  'Mexican': 'mx',
  'Spanish': 'es',
  'French': 'fr',
  'Australian': 'au',
  'German': 'de',
  'Canadian': 'ca',
  'Japanese': 'jp',
  'Chinese': 'cn',
  'Thai': 'th',
  'Danish': 'dk',
  'Finnish': 'fi',
  'Italian': 'it',
  'Monegasque': 'mc',
  'American': 'us',
  'New Zealander': 'nz',
  'Brazilian': 'br',
  'Argentinean': 'ar',
  'Argentine': 'ar'
}

export const getCountryCode = (nationality?: string | null) => countryCodeMap[nationality || '']?.toLowerCase() || 'unknown'
