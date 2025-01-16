<template>
  <div class="overflow-x-auto">
    <table class="table table-zebra">
      <thead>
        <tr>
          <th>Position</th>
          <th>{{ type === 'drivers' ? 'Pilote' : 'Écurie' }}</th>
          <th>{{ type === 'drivers' ? 'Équipe' : 'Nationalité' }}</th>
          <th>Points</th>
          <th>Victoires</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in standings" :key="item.position">
          <td>{{ item.position }}</td>
          <td>
            <template v-if="type === 'drivers'">
              {{ `${item.Driver.givenName} ${item.Driver.familyName}` }}
            </template>
            <template v-else>
              {{ item.Constructor.name }}
            </template>
          </td>
          <td>
            <template v-if="type === 'drivers'">
              {{ item.Constructors[0]?.name }}
            </template>
            <template v-else>
              {{ item.Constructor.nationality }}
            </template>
          </td>
          <td>{{ item.points }}</td>
          <td>{{ item.wins }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Driver, Constructor } from '~/types/f1'

defineProps({
  standings: {
    type: Array as PropType<Driver[] | Constructor[]>,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: (value: string) => ['drivers', 'constructors'].includes(value)
  }
})
</script>