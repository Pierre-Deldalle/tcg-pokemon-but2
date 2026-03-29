<template>
  <div class="edit-deck">
    <h1>Modifier le deck</h1>

    <NSpin v-if="isLoading && !deck" />

    <template v-else-if="deck">
      <NAlert v-if="errorMessage" type="error" style="margin-bottom: 16px">
        {{ errorMessage }}
      </NAlert>

      <NFormItem
        label="Nom du deck"
        :feedback="nameFeedback"
        :validation-status="nameFeedback ? 'error' : undefined"
      >
        <NInput v-model:value="deckName" placeholder="Ex : Mon équipe feu" />
      </NFormItem>

      <div class="counter">
        <span
          :class="{
            'counter--ok': selectedIds.length === MAX_CARDS,
            'counter--error': selectedIds.length !== MAX_CARDS,
          }"
        >
          {{ selectedIds.length }} / {{ MAX_CARDS }} cartes sélectionnées
        </span>
      </div>

      <GridCards
        v-model="selectedIds"
        :selectable="true"
        :max-selected="MAX_CARDS"
        size="sm"
        :cols="8"
      />

      <div class="form-actions">
        <NButton @click="router.push(`/decks/${deck.id}`)">Annuler</NButton>
        <NButton
          type="primary"
          :loading="isLoading"
          :disabled="!isValid"
          @click="handleSubmit"
        >
          Enregistrer
        </NButton>
      </div>
    </template>

    <NAlert v-else-if="errorMessage" type="error">{{ errorMessage }}</NAlert>
  </div>
</template>

<script setup lang="ts">
import { NAlert, NButton, NFormItem, NInput, NSpin } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import GridCards from '@/components/cards/GridCards.component.vue'
import { useApi } from '@/composables/useApi'
import type { Deck } from '@/types'

const MAX_CARDS = 10

const api = useApi()
const route = useRoute()
const router = useRouter()

const deck = ref<Deck | null>(null)
const deckName = ref('')
const selectedIds = ref<number[]>([])
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

const nameFeedback = computed(() =>
  deckName.value.trim() === '' ? 'Le nom est requis.' : undefined,
)

const isValid = computed(
  () => deckName.value.trim() !== '' && selectedIds.value.length === MAX_CARDS,
)

onMounted(async () => {
  isLoading.value = true
  errorMessage.value = null
  try {
    const id = route.params.id as string
    deck.value = await api.getDeck(id)
    deckName.value = deck.value.name
    selectedIds.value = deck.value.cards.map((dc) => dc.cardId)
  } catch (e: unknown) {
    errorMessage.value = (e as Error).message ?? 'Erreur lors du chargement.'
  } finally {
    isLoading.value = false
  }
})

const handleSubmit = async () => {
  if (!isValid.value || !deck.value) return
  isLoading.value = true
  errorMessage.value = null
  try {
    await api.updateDeck(deck.value.id, {
      name: deckName.value.trim(),
      cards: selectedIds.value,
    })
    router.push(`/decks/${deck.value.id}`)
  } catch (e: unknown) {
    errorMessage.value =
      (e as Error).message ?? 'Erreur lors de la mise à jour.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.edit-deck {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}

h1 {
  margin-bottom: 24px;
}

.counter {
  margin: 12px 0;
  font-weight: 500;
}

.counter--ok {
  color: #18a058;
}

.counter--error {
  color: #d03050;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}
</style>
