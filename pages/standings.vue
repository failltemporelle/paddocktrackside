<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Classements F1 {{ currentYear }}</h1>

    <!-- Year selector -->
    <YearSelector v-model:year="selectedYear" />

    <!-- Tabs -->
    <div class="tabs tabs-boxed mb-6">
      <a 
        class="tab" 
        :class="{ 'tab-active': activeTab === 'drivers' }"
        @click="activeTab = 'drivers'"
      >
        Pilotes
      </a>
      <a 
        class="tab" 
        :class="{ 'tab-active': activeTab === 'constructors' }"
        @click="activeTab = 'constructors'"
      >
        Constructeurs
      </a>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="alert alert-error">
      <span>{{ error }}</span>
    </div>

    <!-- Content -->
    <div v-else>
      <div v-if="activeTab === 'drivers'">
        <DriversGrid :drivers="drivers" />
      </div>
      <div v-else>
        <ConstructorsGrid :constructors="constructors" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { fetchDriverStandings, fetchConstructorStandings } = useErgastApi()
const currentYear = new Date().getFullYear()

const loading = ref(false)
const error = ref<string | null>(null)
const activeTab = ref('drivers')
const selectedYear = ref(currentYear)
const drivers = ref([])
const constructors = ref([])

const fetchStandings = async () => {
  loading.value = true
  error.value = null
  
  try {
    const [driversData, constructorsData] = await Promise.all([
      fetchDriverStandings(selectedYear.value),
      fetchConstructorStandings(selectedYear.value)
    ])
    
    drivers.value = driversData
    constructors.value = constructorsData
  } catch (e) {
    error.value = "Une erreur s'est produite lors du chargement des classements"
    console.error('Error loading standings:', e)
  } finally {
    loading.value = false
  }
}

// Fetch data when year changes
watch(() => selectedYear.value, fetchStandings, { immediate: true })
</script>