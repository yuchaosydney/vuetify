import { defineComponent, h } from 'vue'
import { provideTheme } from '../../composables/theme'
import './VThemeProvider.sass'

export const VThemeProvider = defineComponent({
  props: {
    theme: {
      type: String,
    },
  },
  setup (props, { slots }) {
    const { themeClass } = provideTheme(props)

    return () => h('div', {
      class: ['v-theme-provider', themeClass.value],
    }, [h('div', [slots.default?.()])])
  },
})
