<template>
  <NSpace id="space" vertical align="center" justify="center">
    <NForm class="form-inscription" @submit.prevent="handleSignUp">
      <h1>Inscription</h1>
      <NAlert v-if="errorMessage" type="error" style="margin-bottom: 16px">
        {{ errorMessage }}
      </NAlert>
      <NFormItem label="Nom utilisateur" required style="width: 100%">
        <NInput
          v-model:value="username"
          type="text"
          placeholder="Nom de l'utilisateur"
        />
      </NFormItem>
      <NFormItem label="Email" required style="width: 100%">
        <NInput
          v-model:value="email"
          type="text"
          placeholder="votre@email.com"
        />
      </NFormItem>

      <NFormItem label="Mot de passe" required style="width: 100%">
        <NInput
          v-model:value="password"
          type="password"
          show-password-on="mousedown"
          placeholder="*******"
        />
      </NFormItem>
      <NButton
        type="primary"
        attr-type="submit"
        :loading="isLoading"
        :disabled="isLoading"
        style="width: 100%"
      >
        S'inscrire
      </NButton>
      <div class="footer">
        <p>
          Déjà un compte ?
          <RouterLink to="/connexion"><span>Se connecter</span></RouterLink>
        </p>
      </div>
    </NForm>
  </NSpace>
</template>

<script setup lang="ts">
import type { AxiosError } from 'axios'
import { NAlert, NButton, NForm, NFormItem, NInput, NSpace } from 'naive-ui'
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import { useAuthStore } from '@/store/auth.store'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

const handleSignUp = async () => {
  errorMessage.value = null
  isLoading.value = true
  try {
    await authStore.signUp({
      username: username.value,
      email: email.value,
      password: password.value,
    })
    router.push('/')
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>
    errorMessage.value =
      axiosError.response?.data?.message ?? 'Email ou mot de passe incorrect.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
#space {
  min-height: 85vh;
}

.form-inscription {
  width: 400px;
}

.footer {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.footer span {
  text-decoration: none;
  transition: all 0.3s;
}

.footer span:hover {
  color: violet;
}
</style>
