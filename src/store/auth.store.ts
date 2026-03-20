// src/store/auth.ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import { useStorage } from '@/composables/useStorage'
import type { User } from '@/types'

import type { SignUpPayload } from './../types/auth'

export interface SignInPayload {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const { get, set, remove } = useStorage()
  const useAPI = useApi()

  const token = ref(get<string>('token'))
  const user = ref(get<User>('user'))

  const isAuthenticated = computed((): boolean => {
    return !!(token.value && user.value)
  })

  const signUp = async (payload: SignUpPayload) => {
    const { username, email, password } = payload
    const response = await useAPI.signUp({ username, email, password })
    set('token', response.token)
    set('user', response.user)
    token.value = response.token
    user.value = response.user
  }

  const signIn = async (payload: SignInPayload) => {
    const { email, password } = payload
    const response = await useAPI.signIn({ email, password })
    set('token', response.token)
    set('user', response.user)
    token.value = response.token
    user.value = response.user
  }

  const logout = () => {
    remove('token')
    remove('user')
    token.value = null
    user.value = null
  }

  return { token, user, isAuthenticated, signUp, signIn, logout }
})
