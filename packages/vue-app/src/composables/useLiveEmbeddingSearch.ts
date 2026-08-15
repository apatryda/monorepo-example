import type { ClosestEmbeddingResult, EmbeddingClient } from '@/services/embeddingClient'
import debounce from 'lodash-es/debounce'
import { ref, watch } from 'vue'

export interface UseLiveEmbeddingSearchOptions {
  debounceMs?: number
  minLength?: number
  limit?: number
}

export function useLiveEmbeddingSearch (
  client: Pick<EmbeddingClient, 'findClosest'>,
  options: UseLiveEmbeddingSearchOptions = {},
) {
  const { debounceMs = 500, minLength = 3, limit = 16 } = options

  const text = ref('')
  const closestEmbeddings = ref<ClosestEmbeddingResult[] | null>(null)
  const inProgress = ref(false)
  const selectedId = ref<string | null>(null)

  async function search () {
    const value = text.value.trim()
    if (value.length < minLength) {
      closestEmbeddings.value = null
      return
    }

    inProgress.value = true
    try {
      closestEmbeddings.value = await client.findClosest(value, { limit })
    } catch (error) {
      console.error('Error finding closest embeddings:', error)
    } finally {
      inProgress.value = false
    }
  }

  const searchDebounced = debounce(search, debounceMs)

  watch(text, () => {
    searchDebounced()
  })

  function select (id: string | null) {
    const found = closestEmbeddings.value?.find(e => String(e.id) === id)
    if (!found) {
      return
    }

    selectedId.value = id
    text.value = found.text
  }

  return { text, closestEmbeddings, inProgress, selectedId, select }
}
