<template>
  <div class="deck-list">
    <div class="deck-list__header">
      <h2>Mes decks</h2>
      <NButton type="primary" @click="router.push('/decks/create')">
        + Créer un deck
      </NButton>
    </div>

    <NSpin v-if="isLoading" />
    <NAlert v-else-if="errorMessage" type="error">{{ errorMessage }}</NAlert>
    <NEmpty
      v-else-if="decks.length === 0"
      description="Vous n'avez aucun deck pour le moment."
    />

    <NList v-else bordered>
      <NListItem v-for="deck in decks" :key="deck.id">
        <div class="deck-item">
          <span class="deck-item__name">{{ deck.name }}</span>
          <span class="deck-item__count">{{ deck.cards.length }} cartes</span>
          <div class="deck-item__actions">
            <NButton size="small" @click="router.push(`/decks/${deck.id}`)">
              Voir
            </NButton>
            <NButton
              size="small"
              type="info"
              @click="router.push(`/decks/${deck.id}/edit`)"
            >
              Modifier
            </NButton>
            <NPopconfirm @positive-click="handleDelete(deck.id)">
              <template #trigger>
                <NButton size="small" type="error">Supprimer</NButton>
              </template>
              Supprimer le deck « {{ deck.name }} » ?
            </NPopconfirm>
          </div>
        </div>
      </NListItem>
    </NList>
  </div>
</template>

<script setup lang="ts">
import {
  NAlert,
  NButton,
  NEmpty,
  NList,
  NListItem,
  NPopconfirm,
  NSpin,
} from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from '@/composables/useApi'
import type { Deck } from '@/types'

const api = useApi()
const router = useRouter()

const decks = ref<Deck[]>([])
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const loadDecks = async () => {
  isLoading.value = true
  errorMessage.value = null
  try {
    decks.value = await api.getMyDecks()
  } catch (e: unknown) {
    errorMessage.value = (e as Error).message ?? 'Erreur lors du chargement.'
  } finally {
    isLoading.value = false
  }
}

const handleDelete = async (id: number) => {
  try {
    await api.deleteDeck(id)
    await loadDecks()
  } catch (e: unknown) {
    errorMessage.value =
      (e as Error).message ?? 'Erreur lors de la suppression.'
  }
}

onMounted(loadDecks)
</script>

<style scoped>
.deck-list {
  padding: 24px;
}

.deck-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.deck-list__header h2 {
  margin: 0;
}

.deck-item {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.deck-item__name {
  font-weight: bold;
  flex: 1;
}

.deck-item__count {
  color: #888;
  font-size: 0.85rem;
}

.deck-item__actions {
  display: flex;
  gap: 8px;
}
</style>
