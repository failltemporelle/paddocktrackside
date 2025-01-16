<template>
  <section class="py-16 bg-f1-light">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          Contactez-nous
        </h2>
        <p class="text-gray-600 mb-8">
          Une question ? Une suggestion ? N'hésitez pas à nous contacter.
        </p>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="form-control">
            <input 
              type="email" 
              v-model="email" 
              placeholder="Votre email" 
              class="input input-bordered w-full" 
              required
            />
          </div>
          <div class="form-control">
            <textarea 
              v-model="message" 
              placeholder="Votre message" 
              class="textarea textarea-bordered h-32" 
              required
            ></textarea>
          </div>
          <button type="submit" class="btn btn-primary w-full">
            Envoyer
          </button>
        </form>
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