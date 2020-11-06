// Components
import { VThemeProvider } from '../VThemeProvider'

// Utilities
import { mount } from '@vue/test-utils'

describe('VThemeProvider.ts', () => {
  it('should change based upon root $vuetify', () => {
    const wrapper = mount(VThemeProvider, {
      props: {
        theme: 'dark',
      },
    })

    expect(wrapper.classes).toContain('theme--dark')
  })
})
