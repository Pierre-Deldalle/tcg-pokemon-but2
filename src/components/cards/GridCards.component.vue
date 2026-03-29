<template>
  <NGrid :cols="cols" :x-gap="16" :y-gap="16">
    <NGi v-for="card in cards" :key="card.id">
      <Card
        :card="card"
        :size="size"
        :selected="isSelected(card)"
        :disabled="isDisabled(card)"
        @click="handleCardClick"
      />
    </NGi>
  </NGrid>
</template>

<script setup lang="ts">
import { NGi, NGrid } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import type { Card as CardType } from '@/types'

import Card from './Cards.component.vue'

interface Props {
  cards?: CardType[]
  size?: 'sm' | 'md'
  selectable?: boolean
  maxSelected?: number
  modelValue?: number[]
  cols?: number
}

const props = withDefaults(defineProps<Props>(), {
  cards: undefined,
  size: 'md',
  selectable: false,
  maxSelected: Infinity,
  modelValue: () => [],
  cols: 6,
})

const emit = defineEmits<(e: 'update:modelValue', value: number[]) => void>()

const api = useApi()
const internalCards = ref<CardType[]>([])

const cards = computed(() => props.cards ?? internalCards.value)

onMounted(async () => {
  if (!props.cards) {
    internalCards.value = await api.getCards()
  }
})

const selectedIds = computed(() => props.modelValue)

const isSelected = (card: CardType) => selectedIds.value.includes(card.id)

const isDisabled = (card: CardType) => {
  if (!props.selectable) return false
  if (isSelected(card)) return false
  return selectedIds.value.length >= props.maxSelected
}

const handleCardClick = (card: CardType) => {
  if (!props.selectable) return

  const current = [...selectedIds.value]
  const idx = current.indexOf(card.id)

  if (idx !== -1) {
    current.splice(idx, 1)
  } else {
    if (current.length >= props.maxSelected) return
    current.push(card.id)
  }

  emit('update:modelValue', current)
}
</script>
