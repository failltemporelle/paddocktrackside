<template>
  <section class="py-24 bg-f1-black relative overflow-hidden">
    <!-- Decor -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-f1-red/5 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="container mx-auto px-6 md:px-12 relative z-10">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-4xl md:text-5xl font-display font-bold italic text-white mb-4">
            CONTACTEZ <span class="text-f1-red">NOUS</span>
          </h2>
          <p class="text-gray-400">
            Une question ? Une suggestion ? L'équipe est à votre écoute.
          </p>
        </div>

        <div class="bg-f1-dark-gray/60 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-10 shadow-2xl">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="form-control">
              <label class="label text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">Email</label>
              <input 
                type="email" 
                v-model="email" 
                placeholder="votre@email.com" 
                class="input bg-black/30 border-white/10 text-white placeholder-gray-600 rounded-xl focus:border-f1-red focus:ring-1 focus:ring-f1-red transition-all" 
                required
              />
            </div>
            
            <div class="form-control">
              <label class="label text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">Message</label>
              <textarea 
                v-model="message" 
                placeholder="Votre message..." 
                class="textarea bg-black/30 border-white/10 text-white placeholder-gray-600 rounded-xl h-40 focus:border-f1-red focus:ring-1 focus:ring-f1-red transition-all resize-none" 
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              class="btn w-full bg-f1-red hover:bg-red-600 text-white font-bold border-none rounded-xl h-12 shadow-lg shadow-f1-red/20 hover:shadow-f1-red/40 transition-all transform hover:-translate-y-0.5"
            >
              ENVOYER LE MESSAGE
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const email = ref('')
const message = ref('')

const handleSubmit = () => {
  // Logique d'envoi du formulaire à implémenter
  console.log('Form submitted:', { email: email.value, message: message.value })
  email.value = ''
  message.value = ''
}
</script>