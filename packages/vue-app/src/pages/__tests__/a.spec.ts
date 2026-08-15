import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { findClosest } = vi.hoisted(() => ({ findClosest: vi.fn() }))

vi.mock('@/services/defaultEmbeddingClient', () => ({
  embeddingClient: { findClosest },
}))

const VariantA = await import('../a.vue').then(m => m.default)

describe('Variant A page', () => {
  beforeEach(() => {
    findClosest.mockReset()
  })

  it('should not show results before submitting', () => {
    const wrapper = mount(VariantA)

    expect(wrapper.text()).not.toContain('Closest embeddings')
  })

  describe('after submitting the prompt', () => {
    let wrapper: VueWrapper<InstanceType<typeof VariantA>>

    beforeEach(async () => {
      findClosest.mockResolvedValue([{ id: 1, text: 'closest match', distance: 0 }])
      wrapper = mount(VariantA)

      await wrapper.find('textarea').setValue('search text')
      await wrapper.find('button').trigger('click')
      await flushPromises()
    })

    it('should call findClosest with the submitted text', () => {
      expect(findClosest).toHaveBeenCalledWith('search text')
    })

    it('should render the returned result text', () => {
      expect(wrapper.text()).toContain('closest match')
    })

    it('should render the distance as a percentage', () => {
      expect(wrapper.text()).toContain('100%')
    })
  })
})

function flushPromises () {
  return new Promise(resolve => setTimeout(resolve, 0))
}
