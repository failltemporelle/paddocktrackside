<template>
  <div class="py-4 md:px-4">
    <h1 class="text-3xl font-bold mb-6">Classements F1 {{ selectedYear }}</h1>

    <!-- Year selector -->
    <YearSelector v-model:year="selectedYear" />

    <!-- Tabs -->
    <div class="tabs tabs-boxed mb-6" role="tablist" aria-label="Type de classement">
      <button
        type="button"
        role="tab"
        class="tab min-h-11"
        :class="{ 'tab-active': activeTab === 'drivers' }"
        :aria-selected="activeTab === 'drivers'"
        @click="setTab('drivers')"
      >
        Pilotes
      </button>
      <button
        type="button"
        role="tab"
        class="tab min-h-11"
        :class="{ 'tab-active': activeTab === 'constructors' }"
        :aria-selected="activeTab === 'constructors'"
        @click="setTab('constructors')"
      >
        Constructeurs
      </button>
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
const { fetchDriverStandings, fetchConstructorStandings } = useJolpicaApi()
const route = useRoute()
const router = useRouter()
const currentYear = new Date().getFullYear()

// Année et onglet sont portés par l'URL (?year=2019&tab=constructors) :
// le bouton « Précédent » du navigateur retrouve donc le contexte.
const parseYear = (value: unknown) => {
  const year = parseInt(String(value), 10)
  return Number.isFinite(year) && year >= 1950 && year <= currentYear ? year : currentYear
}

const loading = ref(false)
const error = ref<string | null>(null)
const activeTab = ref<'drivers' | 'constructors'>(route.query.tab === 'constructors' ? 'constructors' : 'drivers')
const selectedYear = ref(parseYear(route.query.year))
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

const setTab = (tab: 'drivers' | 'constructors') => {
  activeTab.value = tab
}

const { generateMeta } = useSeo()
useHead(() => generateMeta({
  title: `Classements F1 ${selectedYear.value} : pilotes et constructeurs | Paddock Track Side`,
  description: `Classement du championnat du monde de Formule 1 ${selectedYear.value} : points, victoires et positions des pilotes et des écuries.`,
  path: '/standings'
}))

// Fetch data when year changes
watch(() => selectedYear.value, fetchStandings, { immediate: true })

// Synchronise l'URL (sans ajouter d'entrée d'historique)
watch([selectedYear, activeTab], ([year, tab]) => {
  router.replace({
    query: {
      ...route.query,
      year: String(year),
      tab: tab === 'constructors' ? 'constructors' : undefined
    }
  })
})
</script>