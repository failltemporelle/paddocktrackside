<template>
  <div class="overflow-x-auto bg-f1-dark-gray/40 backdrop-blur-md rounded-2xl border border-white/5">
    <table class="min-w-max text-center text-sm border-collapse">
      <!-- HEADER -->
      <thead class="bg-white/5 text-xs uppercase text-gray-400 font-bold sticky top-0 z-30">
        <tr>
          <th class="p-3 sticky left-0 z-40 bg-[#1e1e24] border-r border-white/10 text-left w-48 shadow-[2px_0_5px_rgba(0,0,0,0.2)]">
            Pilote
          </th>
          <th 
            v-for="race in races" 
            :key="race.round"
            class="p-2 w-12 border-b border-white/5 whitespace-nowrap min-w-[50px]"
            :title="race.raceName"
          >
            {{ getCountryCode(race.Circuit.Location.country) }}
          </th>
          <th class="p-3 sticky right-0 z-40 bg-[#1e1e24] border-l border-white/10 font-bold text-white w-20 shadow-[-2px_0_5px_rgba(0,0,0,0.2)]">
            Pts
          </th>
        </tr>
      </thead>
      
      <!-- BODY -->
      <tbody class="divide-y divide-white/5">
        <tr 
          v-for="driverRow in driverRows" 
          :key="driverRow.driverId" 
          class="hover:bg-white/5 transition-colors group"
        >
          <!-- DRIVER INFO -->
          <td class="p-2 sticky left-0 z-30 bg-[#15151e] group-hover:bg-[#1f1f26] border-r border-white/10 text-left shadow-[2px_0_5px_rgba(0,0,0,0.2)]">
            <div class="flex items-center gap-3">
              <span class="font-display font-bold italic text-white w-6 text-right">{{ driverRow.position }}</span>
              <span class="w-1 h-8 rounded-full" :class="getTeamColor(driverRow.constructorId)"></span>
              <div class="flex flex-col">
                <span class="font-bold text-white group-hover:text-f1-red transition-colors">
                  {{ driverRow.code }}
                </span>
              </div>
            </div>
          </td>

          <!-- RESULTS CELLS -->
          <td 
            v-for="race in races" 
            :key="race.round" 
            class="p-1 h-full border-r border-white/5 last:border-0 relative"
          >
            <div 
              v-if="driverRow.results[race.round]"
              class="w-8 h-8 mx-auto rounded flex items-center justify-center font-bold text-xs"
              :class="getPositionClass(driverRow.results[race.round].positionText)"
            >
              {{ driverRow.results[race.round].positionText }}
            </div>
          </td>

          <!-- TOTAL POINTS -->
          <td class="p-2 sticky right-0 z-30 bg-[#15151e] group-hover:bg-[#1f1f26] border-l border-white/10 font-bold text-f1-red shadow-[-2px_0_5px_rgba(0,0,0,0.2)]">
            {{ driverRow.totalPoints }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Race, RaceResult, Driver } from '~/types/f1'

const props = defineProps<{
  races: Race[],
  standings: Driver[]
}>()

// Map country names to ISO codes (simplified) for display
const getCountryCode = (country: string) => {
  const map: Record<string, string> = {
    'Bahrain': 'BHR', 'Saudi Arabia': 'SAU', 'Australia': 'AUS', 'Azerbaijan': 'AZE', 'United States': 'USA', 'USA': 'USA',
    'Monaco': 'MCO', 'Spain': 'ESP', 'Canada': 'CAN', 'Austria': 'AUT', 'UK': 'GBR', 'Great Britain': 'GBR',
    'Hungary': 'HUN', 'Belgium': 'BEL', 'Netherlands': 'NLD', 'Italy': 'ITA', 'Singapore': 'SGP',
    'Japan': 'JPN', 'Qatar': 'QAT', 'Mexico': 'MEX', 'Brazil': 'BRA', 'UAE': 'UAE', 'Abu Dhabi': 'UAE',
    'China': 'CHN', 'France': 'FRA', 'Portugal': 'PRT', 'Turkey': 'TUR', 'Russia': 'RUS', 'Germany': 'DEU'
  }
  return map[country] || country.substring(0, 3).toUpperCase()
}

// Process data to organize by driver
const driverRows = computed(() => {
  return props.standings.map(driver => {
    const driverResults: Record<string, RaceResult> = {}
    
    props.races.forEach(race => {
      // Find result for this driver in this race
      // API structure: race.Results is an array of results for that race
      const result = race.Results?.find(r => r.Driver.driverId === driver.Driver.driverId)
      if (result) {
        driverResults[race.round] = result
      }
    })

    return {
      driverId: driver.Driver.driverId,
      code: driver.Driver.code || driver.Driver.familyName.substring(0, 3).toUpperCase(),
      position: driver.position,
      totalPoints: driver.points,
      constructorId: driver.Constructors?.[0]?.constructorId,
      results: driverResults
    }
  })
})

const getPositionClass = (pos: string) => {
  // Handle non-numeric positions (R, D, W, etc.)
  const position = parseInt(pos)
  
  if (isNaN(position)) {
    // DNF (Retirement), DNS, etc.
    return 'bg-red-500/20 text-red-400'
  }

  // Podium
  if (position === 1) return 'bg-[#FFD700] text-black shadow-[0_0_10px_rgba(255,215,0,0.3)]'
  if (position === 2) return 'bg-[#C0C0C0] text-black shadow-[0_0_10px_rgba(192,192,192,0.3)]'
  if (position === 3) return 'bg-[#CD7F32] text-white shadow-[0_0_10px_rgba(205,127,50,0.3)]'
  
  // Points (4-10)
  if (position <= 10) return 'bg-emerald-500/20 text-emerald-400'
  
  // Out of points (11+)
  return 'bg-white/5 text-gray-500'
}

const getTeamColor = (id: string | undefined) => {
  const colors: Record<string, string> = {
    'red_bull': 'bg-[#0600EF]',
    'mercedes': 'bg-[#00D2BE]',
    'ferrari': 'bg-[#DC0000]',
    'mclaren': 'bg-[#FF8700]',
    'aston_martin': 'bg-[#006F62]',
    'alpine': 'bg-[#0090FF]',
    'williams': 'bg-[#005AFF]',
    'haas': 'bg-[#FFFFFF]',
    'alfa': 'bg-[#900000]',
    'alphatauri': 'bg-[#2B4562]',
    'sauber': 'bg-[#52E252]',
    'rb': 'bg-[#1634CB]'
  }
  return colors[id || ''] || 'bg-gray-500'
}
</script>

<style scoped>
/* Scrollbar subtil */
div::-webkit-scrollbar {
  height: 6px;
}
div::-webkit-scrollbar-track {
  background: transparent;
}
div::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}
div::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
