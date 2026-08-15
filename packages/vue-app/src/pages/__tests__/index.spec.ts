import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Home from '../index.vue'

describe('Home (variant chooser)', () => {
  const wrapper = mount(Home, {
    global: { stubs: { RouterLink: RouterLinkStub } },
  })

  const links = wrapper.findAllComponents(RouterLinkStub)
  const targets = links.map(link => link.props('to'))

  it('should link to the A variant', () => {
    expect(targets).toContain('/a')
  })

  it('should link to the B variant', () => {
    expect(targets).toContain('/b')
  })
})
