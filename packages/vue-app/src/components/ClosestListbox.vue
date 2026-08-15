<template lang="pug">
v-list(select-strategy="single-leaf", :selected="selectedArray", @update:selected="onUpdateSelected")
  v-list-item(v-for="e in closestEmbeddings", :key="e.id", :value="String(e.id)")
    .container
      h4.distance {{ distanceToPercentage(e.distance) }}%
      .label
        em(v-if="e.author") {{ e.text }}
        span(v-else) {{ e.text }}
      h5.author(v-if="e.author") {{ e.author }}
</template>

<script setup lang="ts">
  import type { ClosestEmbeddingResult } from '@/services/embeddingClient'
  import { distanceToPercentage } from '@/utils/embeddingDistance'

  const props = defineProps<{
    closestEmbeddings: ClosestEmbeddingResult[]
    selectedId: string | null
  }>()
  const emit = defineEmits<{ 'update:selectedId': [id: string | null] }>()

  const selectedArray = computed(() => (props.selectedId === null ? [] : [props.selectedId]))

  function onUpdateSelected (selected: string[]) {
    emit('update:selectedId', selected[0] ?? null)
  }
</script>
