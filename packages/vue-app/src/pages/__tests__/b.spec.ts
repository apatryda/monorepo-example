import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

const { findClosest } = vi.hoisted(() => ({ findClosest: vi.fn() }))

vi.mock('@/services/defaultEmbeddingClient', () => ({
  embeddingClient: { findClosest },
}))

const VariantB = await import('../b.vue').then(m => m.default)

describe('Variant B page', () => {
  beforeEach(() => {
    findClosest.mockReset()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should not show results before typing', () => {
    const wrapper = mount(VariantB)

    expect(wrapper.text()).not.toContain('%')
  })

  describe('after the debounce window elapses', () => {
    let wrapper: VueWrapper<InstanceType<typeof VariantB>>

    beforeEach(async () => {
      findClosest.mockResolvedValue([{ id: 1, text: 'live match', distance: 0 }])
      wrapper = mount(VariantB)

      await wrapper.find('input').setValue('search text')
      await vi.advanceTimersByTimeAsync(500)
      await nextTick()
    })

    it('should call findClosest with the typed text', () => {
      expect(findClosest).toHaveBeenCalledWith('search text', { limit: 16 })
    })

    it('should render the returned result text', () => {
      expect(wrapper.text()).toContain('live match')
    })

    it('should render the distance as a percentage', () => {
      expect(wrapper.text()).toContain('100%')
    })

    describe('selecting a result', () => {
      beforeEach(async () => {
        findClosest.mockClear()

        await wrapper.find('.v-list-item').trigger('click')
        await nextTick()
      })

      it('should fill the input with the selected result text', () => {
        expect(wrapper.find<HTMLInputElement>('input').element.value).toBe('live match')
      })
    })
  })
})
