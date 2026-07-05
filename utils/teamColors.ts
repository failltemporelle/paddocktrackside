export const teamColorMap: Record<string, string> = {
  'red_bull': '#0600EF',
  'ferrari': '#DC0000',
  'mercedes': '#00D2BE',
  'mclaren': '#FF8700',
  'aston_martin': '#006F62',
  'alpine': '#0090FF',
  'williams': '#005AFF',
  'rb': '#1E3D9B',
  'sauber': '#52E252',
  'haas': '#B6BABD',
  'audi': '#00302E',
  'cadillac': '#8A1538'
}

export const getTeamColor = (constructorId?: string | null) => teamColorMap[constructorId || ''] || '#666666'
