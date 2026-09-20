<template>
  <div>
    <HomeHero />
    <HomeDashboard />
    <HomeFeatures />
    <HomeAbout />
  </div>
</template>

<script setup lang="ts">
const { generateMeta } = useSeo()

useHead(generateMeta({
  title: 'Paddock Track Side | Classements, calendrier et statistiques F1',
  description: 'Paddock Track Side : suivez la Formule 1 avec les classements, le calendrier, les statistiques et les records de chaque saison.'
}))
</script>
