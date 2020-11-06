// Components
import { VThemeProvider } from '../VThemeProvider'

// Utilities
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { mockUseVuetify } from '../../../../test'

describe('VThemeProvider.ts', () => {
  it('should use theme defined in prop', async () => {
    mockUseVuetify()

    const wrapper = mount(VThemeProvider, {
      props: {
        theme: 'dark',
      },
    })

    expect(wrapper.classes('theme--dark')).toBeTruthy()
  })

  it('should use default theme from options', async () => {
    mockUseVuetify({
      theme: {
        defaultTheme: ref('foo'),
      },
    })

    const wrapper = mount(VThemeProvider, {
      props: {},
    })

    expect(wrapper.classes('theme--foo')).toBeTruthy()
  })

  it('should not use parent value if nested', async () => {
    mockUseVuetify({
      theme: {
        defaultTheme: ref('contrast'),
      },
    })

    const Test = defineComponent({
      setup () {
        return () => h(VThemeProvider, () =>
          h(VThemeProvider, { theme: 'dark' })
        )
      },
    })

    const wrapper = mount(Test)

    expect(wrapper.html()).toMatchSnapshot()
  })
})
