<template>
  <div class="overflow-x-auto">
    <table class="table table-zebra">
      <thead>
        <tr>
          <th>Position</th>
          <th>Pilote</th>
          <th>Écurie</th>
          <th>SQ1</th>
          <th>SQ2</th>
          <th>SQ3</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="result in results" :key="result.position">
          <td>{{ result.position }}</td>
          <td>{{ `${result.Driver.givenName} ${result.Driver.familyName}` }}</td>
          <td>{{ result.Constructor.name }}</td>
          <td>{{ result.SQ1 || '-' }}</td>
          <td>{{ result.SQ2 || '-' }}</td>
          <td>{{ result.SQ3 || '-' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { SprintShootoutResult } from '~/types/f1'

defineProps({
  results: {
    type: Array as PropType<SprintShootoutResult[]>,
    required: true
  }
})
</script>