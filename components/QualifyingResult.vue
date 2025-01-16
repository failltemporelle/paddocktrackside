<template>
  <div class="overflow-x-auto">
    <table class="table table-zebra">
      <thead>
        <tr>
          <th>Position</th>
          <th>Pilote</th>
          <th>Écurie</th>
          <th>Q1</th>
          <th>Q2</th>
          <th>Q3</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="result in results" :key="result.position">
          <td>{{ result.position }}</td>
          <td>{{ `${result.Driver.givenName} ${result.Driver.familyName}` }}</td>
          <td>{{ result.Constructor.name }}</td>
          <td>{{ result.Q1 || '-' }}</td>
          <td>{{ result.Q2 || '-' }}</td>
          <td>{{ result.Q3 || '-' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { QualifyingResult } from '~/types/f1'

defineProps({
  results: {
    type: Array as PropType<QualifyingResult[]>,
    required: true
  }
})
</script>