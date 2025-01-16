<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <DriverCard 
      v-for="driver in drivers" 
      :key="driver.position" 
      :driver="driver"
      :max-points="maxPoints"
    />
  </div>
</template>

<script setup lang="ts">
import type { Driver } from '~/types/f1'

const props = defineProps({
  drivers: {
    type: Array as PropType<Driver[]>,
    required: true
  }
})

const maxPoints = computed(() => {
  if (props.drivers.length === 0) return 0
  return Math.max(...props.drivers.map(d => Number(d.points)))
})
</script>