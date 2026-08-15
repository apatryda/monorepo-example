import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createEmbeddingClient, type EmbeddingClient, type FindClosestOptions } from '../embeddingClient'

describe('createEmbeddingClient', () => {
  describe('findClosest', () => {
    let fetchMock: ReturnType<typeof vi.fn>
    let client: EmbeddingClient
    const callFindClosest = (options?: FindClosestOptions) =>
      client.findClosest('hello world', options)

    beforeEach(() => {
      fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) } as Response)
      vi.stubGlobal('fetch', fetchMock)
      client = createEmbeddingClient('http://localhost:3001')
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('should resolve with the parsed results', async () => {
      const results = [{ id: 1, text: 'hello', distance: 0.1 }]
      fetchMock.mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve(results) } as Response)

      const found = callFindClosest()

      await expect(found).resolves.toEqual(results)
    })

    it('should call fetch exactly once', async () => {
      await callFindClosest()

      expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it('should POST to the /embedding endpoint', async () => {
      await callFindClosest()

      const [url] = fetchMock.mock.calls[0]!
      expect(String(url)).toBe('http://localhost:3001/embedding')
    })

    it('should send the text as a JSON POST body', async () => {
      await callFindClosest()

      const [, init] = fetchMock.mock.calls[0]!
      expect(init).toMatchObject({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'hello world' }),
      })
    })

    it('should include limit as a query parameter when provided', async () => {
      await callFindClosest({ limit: 16 })

      const [url] = fetchMock.mock.calls[0]!
      expect(String(url)).toBe('http://localhost:3001/embedding?limit=16')
    })

    it('should reject when the response is not ok', async () => {
      fetchMock.mockResolvedValue({ ok: false, status: 500 } as Response)

      const found = callFindClosest()

      await expect(found).rejects.toThrow('500')
    })
  })
})
