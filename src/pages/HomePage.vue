<template>
  <div class="home">
    <DeckList />
  </div>
</template>

<script setup lang="ts">
import DeckList from '@/components/decks/DeckList.component.vue'
</script>

<style scoped>
.home {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px;
}
</style>
