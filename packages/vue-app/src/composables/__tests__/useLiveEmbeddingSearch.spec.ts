import type { Ref } from 'vue'
import type { ClosestEmbeddingResult } from '@/services/embeddingClient'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLiveEmbeddingSearch } from '../useLiveEmbeddingSearch'

describe('useLiveEmbeddingSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('initial state', () => {
    const { text, closestEmbeddings, inProgress, selectedId } = useLiveEmbeddingSearch({ findClosest: vi.fn() })

    it('should have empty text', () => {
      expect(text.value).toBe('')
    })

    it('should have no closest embeddings', () => {
      expect(closestEmbeddings.value).toBeNull()
    })

    it('should not be in progress', () => {
      expect(inProgress.value).toBe(false)
    })

    it('should have no selected result', () => {
      expect(selectedId.value).toBeNull()
    })
  })

  it('should not search when the trimmed text is shorter than 3 characters, even after the debounce window', async () => {
    const findClosest = vi.fn().mockResolvedValue([])
    const { text } = useLiveEmbeddingSearch({ findClosest })

    text.value = ' hi '
    await vi.advanceTimersByTimeAsync(1000)

    expect(findClosest).not.toHaveBeenCalled()
  })

  describe('waiting for the debounce window', () => {
    const results: ClosestEmbeddingResult[] = [{ id: 1, text: 'hello world', distance: 0.3 }]
    let findClosest: ReturnType<typeof vi.fn>
    let resolveRequest: (value: ClosestEmbeddingResult[]) => void

    beforeEach(() => {
      findClosest = vi.fn(() => new Promise<ClosestEmbeddingResult[]>(resolve => {
        resolveRequest = resolve
      }))
    })

    describe('before the window elapses', () => {
      beforeEach(async () => {
        const { text } = useLiveEmbeddingSearch({ findClosest })

        text.value = 'hello wo'
        await vi.advanceTimersByTimeAsync(499)
      })

      it('should not search yet', () => {
        expect(findClosest).not.toHaveBeenCalled()
      })
    })

    describe('once the window elapses', () => {
      let inProgress: Ref<boolean>
      let closestEmbeddings: Ref<ClosestEmbeddingResult[] | null>

      beforeEach(async () => {
        const composable = useLiveEmbeddingSearch({ findClosest })
        inProgress = composable.inProgress
        closestEmbeddings = composable.closestEmbeddings

        composable.text.value = 'hello wo'
        await vi.advanceTimersByTimeAsync(500)
      })

      it('should be in progress', () => {
        expect(inProgress.value).toBe(true)
      })

      it('should call findClosest with the trimmed text and limit', () => {
        expect(findClosest).toHaveBeenCalledWith('hello wo', { limit: 16 })
      })

      describe('after the request resolves', () => {
        beforeEach(async () => {
          resolveRequest(results)
          await vi.advanceTimersByTimeAsync(0)
        })

        it('should no longer be in progress', () => {
          expect(inProgress.value).toBe(false)
        })

        it('should store the returned results', () => {
          expect(closestEmbeddings.value).toEqual(results)
        })
      })
    })
  })

  describe('rapid keystrokes within the debounce window', () => {
    let findClosest: ReturnType<typeof vi.fn>

    beforeEach(async () => {
      findClosest = vi.fn().mockResolvedValue([])
      const { text } = useLiveEmbeddingSearch({ findClosest })

      text.value = 'he'
      await vi.advanceTimersByTimeAsync(200)
      text.value = 'hel'
      await vi.advanceTimersByTimeAsync(200)
      text.value = 'hello'
      await vi.advanceTimersByTimeAsync(500)
    })

    it('should issue exactly one search', () => {
      expect(findClosest).toHaveBeenCalledTimes(1)
    })

    it('should search with the final text value', () => {
      expect(findClosest).toHaveBeenCalledWith('hello', { limit: 16 })
    })
  })

  describe('selecting a result', () => {
    const results: ClosestEmbeddingResult[] = [
      { id: 1, text: 'first match', distance: 0.1 },
      { id: 2, text: 'second match', distance: 0.2 },
    ]
    let text: Ref<string>
    let selectedId: Ref<string | null>
    let findClosest: ReturnType<typeof vi.fn>

    beforeEach(async () => {
      findClosest = vi.fn().mockResolvedValue(results)
      const composable = useLiveEmbeddingSearch({ findClosest })
      text = composable.text
      selectedId = composable.selectedId

      text.value = 'match'
      await vi.advanceTimersByTimeAsync(500)
      composable.closestEmbeddings.value = results
      findClosest.mockClear()

      composable.select('2')
    })

    it('should fill the text with the selected result content', () => {
      expect(text.value).toBe('second match')
    })

    it('should mark the result as selected', () => {
      expect(selectedId.value).toBe('2')
    })

    describe('after the debounce window elapses again', () => {
      beforeEach(async () => {
        await vi.advanceTimersByTimeAsync(500)
      })

      it('should re-trigger a search with the selected text', () => {
        expect(findClosest).toHaveBeenCalledWith('second match', { limit: 16 })
      })
    })
  })

  it('should leave the text untouched when selecting an unknown id', () => {
    const { text, select } = useLiveEmbeddingSearch({ findClosest: vi.fn() })

    text.value = 'unchanged'
    select('does-not-exist')

    expect(text.value).toBe('unchanged')
  })
})
