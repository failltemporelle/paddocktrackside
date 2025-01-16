<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
    <div class="bg-base-200 p-3 rounded-lg">
      <div class="text-2xl sm:text-3xl font-bold">{{ days }}</div>
      <div class="text-xs sm:text-sm">Jours</div>
    </div>
    <div class="bg-base-200 p-3 rounded-lg">
      <div class="text-2xl sm:text-3xl font-bold">{{ hours }}</div>
      <div class="text-xs sm:text-sm">Heures</div>
    </div>
    <div class="bg-base-200 p-3 rounded-lg">
      <div class="text-2xl sm:text-3xl font-bold">{{ minutes }}</div>
      <div class="text-xs sm:text-sm">Minutes</div>
    </div>
    <div class="bg-base-200 p-3 rounded-lg">
      <div class="text-2xl sm:text-3xl font-bold">{{ seconds }}</div>
      <div class="text-xs sm:text-sm">Secondes</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  }
})

const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

const calculateTimeLeft = () => {
  const raceDate = new Date(`${props.date}T${props.time}`)
  const now = new Date()
  const difference = raceDate.getTime() - now.getTime()

  if (difference > 0) {
    days.value = Math.floor(difference / (1000 * 60 * 60 * 24))
    hours.value = Math.floor((difference / (1000 * 60 * 60)) % 24)
    minutes.value = Math.floor((difference / 1000 / 60) % 60)
    seconds.value = Math.floor((difference / 1000) % 60)
  }
}

let timer: NodeJS.Timer

onMounted(() => {
  calculateTimeLeft()
  timer = setInterval(calculateTimeLeft, 1000)
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>