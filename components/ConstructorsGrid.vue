<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <ConstructorCard 
      v-for="constructor in constructors" 
      :key="constructor.position" 
      :constructor="constructor"
      :max-points="maxPoints"
    />
  </div>
</template>

<script setup lang="ts">
import type { Constructor } from '~/types/f1'

const props = defineProps({
  constructors: {
    type: Array as PropType<Constructor[]>,
    required: true
  }
})

const maxPoints = computed(() => {
  if (props.constructors.length === 0) return 0
  return Math.max(...props.constructors.map(c => Number(c.points)))
})
</script>