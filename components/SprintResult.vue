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
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { SprintResult } from '~/types/f1'

defineProps({
  results: {
    type: Array as PropType<SprintResult[]>,
    required: true
  }
})
</script>