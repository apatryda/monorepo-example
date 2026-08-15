<template lang="pug">
v-container(max-width="900")
  PromptCard(@submit="submit")
  v-progress-circular.mt-4(v-if="inProgress", indeterminate)
  ClosestCard.mt-4(v-else-if="closestEmbeddings", :closest-embeddings="closestEmbeddings")
</template>

<script setup lang="ts">
  import { useClosestEmbeddingSearch } from '@/composables/useClosestEmbeddingSearch'
  import { embeddingClient } from '@/services/defaultEmbeddingClient'

  const { closestEmbeddings, inProgress, submit } = useClosestEmbeddingSearch(embeddingClient)
</script>
