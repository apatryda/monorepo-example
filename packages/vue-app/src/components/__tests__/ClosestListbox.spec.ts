import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ClosestListbox from '../ClosestListbox.vue'

const closestEmbeddings = [
  { id: 1, text: 'first match', distance: 0.1 },
  { id: 2, text: 'second match', distance: 0.2, author: 'Jane Doe' },
]

describe('ClosestListbox', () => {
  describe('rendering results', () => {
    const wrapper = mount(ClosestListbox, {
      props: { closestEmbeddings, selectedId: null },
    })

    it('should show the match percentage for the first result', () => {
      expect(wrapper.text()).toContain('95%')
    })

    it('should show the text for the first result', () => {
      expect(wrapper.text()).toContain('first match')
    })

    it('should show the match percentage for the second result', () => {
      expect(wrapper.text()).toContain('90%')
    })

    it('should show the text for the second result', () => {
      expect(wrapper.text()).toContain('second match')
    })

    it('should show the author for the second result', () => {
      expect(wrapper.text()).toContain('Jane Doe')
    })
  })

  it('should emit update:selectedId with the clicked item id', async () => {
    const wrapper = mount(ClosestListbox, {
      props: { closestEmbeddings, selectedId: null },
    })

    const items = wrapper.findAll('.v-list-item')
    await items[1]!.trigger('click')

    expect(wrapper.emitted('update:selectedId')).toEqual([['2']])
  })
})
