import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './store/auth.store'

import HomePage from './pages/HomePage.vue'
import InscriptionPage from './pages/InscriptionPage.vue'
import ConnexionPage from './pages/ConnexionPage.vue'

export const ROUTES = {
  HOME: '/',
  CONNEXION: '/connexion',
  INSCRIPTION: '/inscription',
} as const

const routes = [
  { path: ROUTES.HOME, component: HomePage, meta: { requiresAuth: true } },
  {
    path: ROUTES.CONNEXION,
    component: ConnexionPage,
    meta: { requiresAuth: false },
  },
  {
    path: ROUTES.INSCRIPTION,
    component: InscriptionPage,
    meta: { requiresAuth: false },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return ROUTES.CONNEXION
  }

  if (!to.meta.requiresAuth && auth.isAuthenticated) {
    return ROUTES.HOME
  }

  return true
})

export default router
