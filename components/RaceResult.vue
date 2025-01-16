<template>
  <div class="overflow-x-auto">
    <table class="table table-zebra">
      <thead>
        <tr>
          <th>Position</th>
          <th>Pilote</th>
          <th>Écurie</th>
          <th>Points</th>
          <th>Grille</th>
          <th>Tours</th>
          <th>Temps/Status</th>
          <th>Meilleur tour</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="result in results" :key="result.position">
          <td>{{ result.position }}</td>
          <td>{{ `${result.Driver.givenName} ${result.Driver.familyName}` }}</td>
          <td>{{ result.Constructor.name }}</td>
          <td>{{ result.points }}</td>
          <td>{{ result.grid }}</td>
          <td>{{ result.laps }}</td>
          <td>{{ result.Time?.time || result.status }}</td>
          <td>
            <span v-if="result.FastestLap" class="flex items-center gap-2">
              {{ result.FastestLap.Time.time }}
              <div 
                v-if="result.FastestLap.rank === '1'" 
                class="badge badge-purple"
                title="Meilleur tour en course"
              >
                🏁
              </div>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { RaceResult } from '~/types/f1'

defineProps({
  results: {
    type: Array as PropType<RaceResult[]>,
    required: true
  }
})
</script>