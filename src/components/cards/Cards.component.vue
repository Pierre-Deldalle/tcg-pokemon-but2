<template>
  <div
    class="card-wrapper"
    :class="[
      `card--${size}`,
      { 'card--selected': selected, 'card--disabled': disabled },
    ]"
    @click="handleClick"
  >
    <NCard size="small" hoverable :class="{ 'inner-selected': selected }">
      <img :src="card.imgUrl" :alt="`Image de ${card.name}`" class="card-img" />
      <p class="card-dex">#{{ card.pokedexNumber }}</p>
      <p class="card-name">{{ card.name }}</p>
      <p
        class="card-type"
        :style="{ backgroundColor: colors.getTypeColor(card.type) }"
      >
        {{ card.type }}
      </p>
      <div v-if="currentHp !== undefined" class="hp-bar-wrapper">
        <div
          class="hp-bar"
          :style="{
            width: hpPercent + '%',
            backgroundColor: colors.hpColor(hpPercent),
          }"
        />
      </div>

      <div class="stats">
        <span>❤️ {{ card.hp }}</span>
        <span>⚔️ {{ card.attack }}</span>
      </div>

      <div v-if="selected" class="selected-badge">✓</div>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { NCard } from 'naive-ui'
import { computed } from 'vue'

import { useColors } from '@/composables/useColors'
import type { Card } from '@/types/card'

defineOptions({ name: 'PokemonCard' })

const colors = useColors()

interface Props {
  card: Card
  size?: 'sm' | 'md'
  selected?: boolean
  disabled?: boolean
  currentHp?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  selected: false,
  disabled: false,
  currentHp: undefined,
})

const emit = defineEmits<(e: 'click', card: Card) => void>()

const hpPercent = computed(() =>
  props.currentHp !== undefined
    ? Math.min(
        100,
        Math.max(0, Math.round((props.currentHp / props.card.hp) * 100)),
      )
    : 0,
)

const handleClick = () => {
  if (!props.disabled) {
    emit('click', props.card)
  }
}
</script>

<style scoped>
.card-wrapper {
  position: relative;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;
  border-radius: 8px;
}

.card--sm {
  font-size: 0.75rem;
  max-width: 130px;
}

.card--md {
  font-size: 0.9rem;
  max-width: 200px;
}

.card--selected {
  transform: translateY(-4px);
  outline: 2px solid #63e2b7;
  border-radius: 8px;
}

.inner-selected {
  background-color: rgba(99, 226, 183, 0.08);
}

.card--disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.card-img {
  width: 100%;
  display: block;
}

.card-dex,
.card-name,
.card-type {
  text-align: center;
  margin: 4px 0;
}

.card-name {
  font-weight: bold;
}

.card-type {
  color: white;
  border-radius: 12px;
  padding: 1px 10px;
  display: inline-block;
  margin: 4px auto;
  font-size: 0.75em;
  width: fit-content;
  left: 50%;
  position: relative;
  transform: translateX(-50%);
}

.hp-bar-wrapper {
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  margin: 6px 8px;
  overflow: hidden;
}

.hp-bar {
  height: 100%;
  border-radius: 3px;
  transition:
    width 0.3s ease,
    background-color 0.3s ease;
}

.stats {
  display: flex;
  justify-content: space-between;
  margin: 4px 8px 0;
  font-size: 0.85em;
}

.selected-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  background-color: #63e2b7;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  z-index: 1;
}
</style>
