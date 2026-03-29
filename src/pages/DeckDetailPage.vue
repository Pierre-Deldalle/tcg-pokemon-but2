<template>
  <div class="deck-detail">
    <NSpin v-if="isLoading" />

    <template v-else-if="deck">
      <div class="deck-detail__header">
        <div>
          <h1>{{ deck.name }}</h1>
          <span class="deck-detail__subtitle"
            >{{ deckCards.length }} cartes</span
          >
        </div>
        <div class="deck-detail__actions">
          <NButton @click="router.push('/')">← Retour</NButton>
          <NButton
            type="primary"
            @click="router.push(`/decks/${deck.id}/edit`)"
          >
            Modifier
          </NButton>
        </div>
      </div>

      <NAlert v-if="deckCards.length === 0" type="warning">
        Ce deck ne contient aucune carte.
      </NAlert>

      <NGrid v-else :cols="5" :x-gap="16" :y-gap="16">
        <NGi v-for="card in deckCards" :key="card.id">
          <Card :card="card" size="md" />
        </NGi>
      </NGrid>
    </template>

    <NAlert v-else-if="errorMessage" type="error">{{ errorMessage }}</NAlert>
  </div>
</template>

<script setup lang="ts">
import { NAlert, NButton, NGi, NGrid, NSpin } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Card from '@/components/cards/Cards.component.vue'
import { useApi } from '@/composables/useApi'
import type { Card as CardType, Deck } from '@/types'

const api = useApi()
const route = useRoute()
const router = useRouter()

const deck = ref<Deck | null>(null)
const allCards = ref<CardType[]>([])
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

const deckCards = computed(() => {
  if (!deck.value) return []
  const cardIds = deck.value.cards.map((dc) => dc.cardId)
  return allCards.value.filter((c) => cardIds.includes(c.id))
})

onMounted(async () => {
  isLoading.value = true
  errorMessage.value = null
  try {
    const id = route.params.id as string
    ;[deck.value, allCards.value] = await Promise.all([
      api.getDeck(id),
      api.getCards(),
    ])
  } catch (e: unknown) {
    errorMessage.value = (e as Error).message ?? 'Erreur lors du chargement.'
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.deck-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 16px;
}

.deck-detail__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.deck-detail__header h1 {
  margin: 0 0 4px;
}

.deck-detail__subtitle {
  color: #888;
  font-size: 0.9rem;
}

.deck-detail__actions {
  display: flex;
  gap: 8px;
}
</style>
