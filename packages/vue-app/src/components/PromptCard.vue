<template lang="pug">
v-card(elevation="5")
  v-card-title Embedding Search

  v-card-text
    p.mb-2 Enter text, for which to find closest embeddings:
    v-textarea(v-model="text", placeholder="Enter text", rows="5")/

  v-card-actions
    v-btn(@click="emit('submit', text)") Query
</template>

<script setup lang="ts">
  const emit = defineEmits<{ submit: [text: string] }>()

  const text = ref('')
</script>
