<template>
  <div class="container mx-auto p-4">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Mon Compte</h1>
      
      <div v-if="loading" class="flex justify-center">
        <span class="loading loading-spinner loading-lg"></span>
      </div>

      <div v-else-if="user" class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <form @submit.prevent="updateProfile" class="space-y-6">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Nom d'utilisateur</span>
              </label>
              <input 
                type="text" 
                v-model="displayName" 
                class="input input-bordered" 
                placeholder="Votre nom"
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input 
                type="email" 
                v-model="email" 
                class="input input-bordered" 
                :disabled="true"
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Nouveau mot de passe</span>
              </label>
              <input 
                type="password" 
                v-model="newPassword" 
                class="input input-bordered" 
                placeholder="Laissez vide pour ne pas changer"
              />
            </div>

            <div v-if="error" class="alert alert-error">
              <span>{{ error }}</span>
            </div>

            <div v-if="success" class="alert alert-success">
              <span>{{ success }}</span>
            </div>

            <div class="flex justify-end gap-4">
              <button 
                type="button" 
                class="btn btn-ghost" 
                @click="$router.push('/')"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                class="btn btn-primary" 
                :disabled="updating"
              >
                <span v-if="updating" class="loading loading-spinner"></span>
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <h2 class="text-2xl font-bold mb-4">Vous devez être connecté</h2>
        <NuxtLink to="/login" class="btn btn-primary">
          Se connecter
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { updateProfile as updateFirebaseProfile, updatePassword, updateEmail } from 'firebase/auth'

const { user } = useAuth()
const router = useRouter()

const loading = ref(false)
const updating = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

const displayName = ref(user.value?.displayName || '')
const email = ref(user.value?.email || '')
const newPassword = ref('')

const updateProfile = async () => {
  if (!user.value) return

  updating.value = true
  error.value = null
  success.value = null

  try {
    const updates = []

    // Update display name if changed
    if (displayName.value !== user.value.displayName) {
      updates.push(updateFirebaseProfile(user.value, {
        displayName: displayName.value
      }))
    }

    // Update email if changed
    if (email.value !== user.value.email) {
      updates.push(updateEmail(user.value, email.value))
    }

    // Update password if provided
    if (newPassword.value) {
      updates.push(updatePassword(user.value, newPassword.value))
    }

    await Promise.all(updates)
    success.value = 'Profil mis à jour avec succès'
    newPassword.value = '' // Clear password field after success
  } catch (e: any) {
    error.value = e.message
  } finally {
    updating.value = false
  }
}

// Initialize form with user data when available
watch(() => user.value, (newUser) => {
  if (newUser) {
    displayName.value = newUser.displayName || ''
    email.value = newUser.email || ''
  }
}, { immediate: true })
</script>