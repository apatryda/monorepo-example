import { createEmbeddingClient } from './embeddingClient'

const baseUrl = import.meta.env.VITE_NEST_APP_URL ?? 'http://localhost:3001'

export const embeddingClient = createEmbeddingClient(baseUrl)
