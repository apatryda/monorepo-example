<template lang="pug">
v-container(max-width="900")
  v-card(elevation="5")
    v-card-title Embedding Search
    v-card-text
      v-text-field(v-model="text", placeholder="Enter text")/

  v-progress-circular.mt-4(v-if="inProgress", indeterminate)/
  ClosestListbox.mt-4(
    v-else-if="closestEmbeddings",
    :closest-embeddings="closestEmbeddings",
    :selected-id="selectedId",
    @update:selected-id="select"
  )/
</template>

<script setup lang="ts">
  import { useLiveEmbeddingSearch } from '@/composables/useLiveEmbeddingSearch'
  import { embeddingClient } from '@/services/defaultEmbeddingClient'

  const { text, closestEmbeddings, inProgress, selectedId, select } = useLiveEmbeddingSearch(embeddingClient)
</script>
