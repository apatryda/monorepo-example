<template lang="pug">
v-card(elevation="0")
  v-card-title Closest embeddings:

  v-card-text
    .result(v-for="e in closestEmbeddings", :key="e.id")
      h3 {{ distanceToPercentage(e.distance) }}%
      p {{ e.text }}
      h4(v-if="e.author") {{ e.author }}
</template>

<script setup lang="ts">
  import type { ClosestEmbeddingResult } from '@/services/embeddingClient'
  import { distanceToPercentage } from '@/utils/embeddingDistance'

  defineProps<{ closestEmbeddings: ClosestEmbeddingResult[] }>()
</script>
