<template>
  <NSpace id="space" vertical align="center" justify="center">
    <NForm class="form-connexion" @submit.prevent="handleSignIn">
      <h1>Connexion</h1>
      <NAlert v-if="errorMessage" type="error" style="margin-bottom: 16px">
        {{ errorMessage }}
      </NAlert>
      <NFormItem label="Email" path="email">
        <NInput v-model:value="form.email" placeholder="votre@email.com" />
      </NFormItem>
      <NFormItem label="Mot de passe" path="motdepasse">
        <NInput
          v-model:value="form.motdepasse"
          type="password"
          show-password-on="mousedown"
          placeholder="*******"
        />
      </NFormItem>

      <div class="footer-form">
        <NButton type="primary" attr-type="submit" :loading="isLoading" :disabled="isLoading">
          Se connecter
        </NButton>
        <p>
          Pas encore de compte ?
          <RouterLink to="/inscription">S'inscrire</RouterLink>
        </p>
      </div>
    </NForm>
  </NSpace>
</template>

<script setup lang="ts">
import { NAlert, NButton, NForm, NFormItem, NInput, NSpace } from 'naive-ui'
import { RouterLink, useRouter } from 'vue-router'
import { reactive, ref } from 'vue'

import { useAuthStore } from '@/store/auth.store'

const authStore = useAuthStore()
const router = useRouter()

const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

const form = reactive({
  email: '',
  motdepasse: '',
})

const handleSignIn = async () => {
  errorMessage.value = null
  isLoading.value = true
  try {
    await authStore.signIn({
      email: form.email,
      password: form.motdepasse,
    })
    router.push('/')
  } catch (error: any) {
    errorMessage.value =
      error?.response?.data?.message ?? 'Email ou mot de passe incorrect.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
#space {
  min-height: 85vh;
}

.form-connexion {
  width: 400px;
}

.footer-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 25px;
}

.footer-form .n-button {
  width: 100%;
}
</style>