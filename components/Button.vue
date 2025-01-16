<template>
  <button 
    class="btn relative overflow-hidden group"
    :class="[
      variant === 'primary' ? 'btn-primary' : 'btn-ghost',
      size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '',
      { 'loading': loading }
    ]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <span class="relative z-10">
      <slot></slot>
    </span>
    <div 
      class="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"
    ></div>
  </button>
</template>

<script setup lang="ts">
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>