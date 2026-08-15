import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PromptCard from '../PromptCard.vue'

describe('PromptCard', () => {
  it('should emit submit with the entered text when the button is clicked', async () => {
    const wrapper = mount(PromptCard)

    await wrapper.find('textarea').setValue('find me something')
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('submit')).toEqual([['find me something']])
  })

  it('should not emit submit just from typing', async () => {
    const wrapper = mount(PromptCard)

    await wrapper.find('textarea').setValue('not submitted yet')

    expect(wrapper.emitted('submit')).toBeUndefined()
  })
})
