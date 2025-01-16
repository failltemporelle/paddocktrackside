<template>
  <div 
    class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
    :class="{ 'animate-slide-up': animate }"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  animate: {
    type: Boolean,
    default: false
  }
})
</script>