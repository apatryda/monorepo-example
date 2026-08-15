export interface ClosestEmbeddingResult {
  id: number
  text: string
  distance: number
  author?: string
}

export interface FindClosestOptions {
  limit?: number
}

export function createEmbeddingClient (baseUrl: string) {
  return {
    async findClosest (text: string, options: FindClosestOptions = {}): Promise<ClosestEmbeddingResult[]> {
      const url = new URL('/embedding', baseUrl)
      if (options.limit !== undefined) {
        url.searchParams.set('limit', String(options.limit))
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error(`Embedding request failed with status ${response.status}`)
      }

      return response.json()
    },
  }
}

export type EmbeddingClient = ReturnType<typeof createEmbeddingClient>
