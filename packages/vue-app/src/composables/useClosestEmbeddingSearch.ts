import type { ClosestEmbeddingResult, EmbeddingClient } from '@/services/embeddingClient'
import { ref } from 'vue'

export function useClosestEmbeddingSearch (client: Pick<EmbeddingClient, 'findClosest'>) {
  const closestEmbeddings = ref<ClosestEmbeddingResult[] | null>(null)
  const inProgress = ref(false)

  async function submit (text: string) {
    inProgress.value = true
    try {
      closestEmbeddings.value = await client.findClosest(text)
    } catch (error) {
      console.error('Error finding closest embeddings:', error)
    } finally {
      inProgress.value = false
    }
  }

  return { closestEmbeddings, inProgress, submit }
}
