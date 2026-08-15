import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ClosestCard from '../ClosestCard.vue'

describe('ClosestCard', () => {
  describe('rendering multiple results', () => {
    const wrapper = mount(ClosestCard, {
      props: {
        closestEmbeddings: [
          { id: 1, text: 'hello world', distance: 0 },
          { id: 2, text: 'goodbye', distance: 2 },
        ],
      },
    })

    it('should show the match percentage for the first result', () => {
      expect(wrapper.text()).toContain('100%')
    })

    it('should show the text for the first result', () => {
      expect(wrapper.text()).toContain('hello world')
    })

    it('should show the match percentage for the second result', () => {
      expect(wrapper.text()).toContain('0%')
    })

    it('should show the text for the second result', () => {
      expect(wrapper.text()).toContain('goodbye')
    })
  })

  describe('author', () => {
    const wrapper = mount(ClosestCard, {
      props: {
        closestEmbeddings: [
          { id: 1, text: 'with author', distance: 0.5, author: 'Jane Doe' },
          { id: 2, text: 'without author', distance: 0.5 },
        ],
      },
    })

    it('should show the author when present', () => {
      expect(wrapper.text()).toContain('Jane Doe')
    })

    it('should not render an author element when absent', () => {
      expect(wrapper.findAll('h4')).toHaveLength(1)
    })
  })
})
