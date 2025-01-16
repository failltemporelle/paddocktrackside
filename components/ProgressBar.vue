<template>
  <div 
    class="relative w-full h-2 bg-base-200 rounded-full overflow-hidden" 
    role="progressbar" 
    :aria-valuenow="percentage" 
    aria-valuemin="0" 
    aria-valuemax="100"
  >
    <div 
      class="absolute top-0 left-0 h-full transition-all duration-300 ease-out rounded-full bg-primary"
      :class="{ 'bg-opacity-50': value === 0 }"
      :style="{ width: `${percentage}%` }"
      :title="`${value} points - ${percentage}%`"
    >
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
    </div>
    <div 
      class="tooltip tooltip-top absolute -top-8 left-1/2 transform -translate-x-1/2" 
      :data-tip="`${value} points`"
    >
      <span class="text-xs font-medium">{{ percentage }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  maxValue: {
    type: Number,
    required: true
  }
})

const percentage = computed(() => {
  if (props.maxValue === 0) return 0
  return Math.round((props.value / props.maxValue) * 100)
})
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>