import type { Ref } from 'vue'
import type { ClosestEmbeddingResult } from '@/services/embeddingClient'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useClosestEmbeddingSearch } from '../useClosestEmbeddingSearch'

describe('useClosestEmbeddingSearch', () => {
  describe('initial state', () => {
    const { closestEmbeddings, inProgress } = useClosestEmbeddingSearch({ findClosest: vi.fn() })

    it('should have no closest embeddings', () => {
      expect(closestEmbeddings.value).toBeNull()
    })

    it('should not be in progress', () => {
      expect(inProgress.value).toBe(false)
    })
  })

  describe('submit', () => {
    describe('while the request is pending', () => {
      let inProgress: Ref<boolean>

      beforeEach(async () => {
        const findClosest = vi.fn(() => new Promise<ClosestEmbeddingResult[]>(() => {}))
        const composable = useClosestEmbeddingSearch({ findClosest })
        inProgress = composable.inProgress

        void composable.submit('hello world')
        await Promise.resolve()
      })

      it('should be in progress', () => {
        expect(inProgress.value).toBe(true)
      })
    })

    describe('after resolving successfully', () => {
      const results: ClosestEmbeddingResult[] = [{ id: 1, text: 'hello', distance: 0.2 }]
      let closestEmbeddings: Ref<ClosestEmbeddingResult[] | null>
      let inProgress: Ref<boolean>
      let findClosest: ReturnType<typeof vi.fn>

      beforeEach(async () => {
        findClosest = vi.fn().mockResolvedValue(results)
        const composable = useClosestEmbeddingSearch({ findClosest })
        closestEmbeddings = composable.closestEmbeddings
        inProgress = composable.inProgress

        await composable.submit('hello world')
      })

      it('should no longer be in progress', () => {
        expect(inProgress.value).toBe(false)
      })

      it('should store the returned results', () => {
        expect(closestEmbeddings.value).toEqual(results)
      })

      it('should call findClosest with the submitted text', () => {
        expect(findClosest).toHaveBeenCalledWith('hello world')
      })
    })

    describe('when the request fails', () => {
      let closestEmbeddings: Ref<ClosestEmbeddingResult[] | null>
      let inProgress: Ref<boolean>
      let submitPromise: Promise<void>

      beforeEach(() => {
        const findClosest = vi.fn().mockRejectedValue(new Error('network error'))
        const composable = useClosestEmbeddingSearch({ findClosest })
        closestEmbeddings = composable.closestEmbeddings
        inProgress = composable.inProgress

        submitPromise = composable.submit('hello')
      })

      it('should resolve without throwing', async () => {
        await expect(submitPromise).resolves.toBeUndefined()
      })

      it('should stop the spinner', async () => {
        await submitPromise

        expect(inProgress.value).toBe(false)
      })

      it('should not store any results', async () => {
        await submitPromise

        expect(closestEmbeddings.value).toBeNull()
      })
    })
  })
})
