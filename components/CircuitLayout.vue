<template>
  <div class="relative aspect-video rounded-xl overflow-hidden bg-base-200">
    <img 
      :src="circuitImage" 
      :alt="circuit.circuitName"
      class="object-contain w-full h-full"
      @error="handleImageError"
      :class="{ 'opacity-0': loading, 'opacity-100': !loading }"
      @load="loading = false"
      loading="lazy"
    />
    <div 
      v-if="loading || showPlaceholder" 
      class="absolute inset-0 bg-base-200 flex items-center justify-center"
    >
      <div v-if="loading" class="loading loading-spinner loading-lg"></div>
      <div v-else class="text-4xl">🏎️</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  circuit: {
    type: Object as PropType<{
      circuitId: string
      circuitName: string
    }>,
    required: true
  }
})

const { getCircuitImage } = useCircuitImages()
const circuitImage = getCircuitImage(props.circuit.circuitId)
const showPlaceholder = ref(false)
const loading = ref(true)

const handleImageError = () => {
  showPlaceholder.value = true
  loading.value = false
}
</script>

<style scoped>
img {
  @apply transition-opacity duration-300;
}
</style>