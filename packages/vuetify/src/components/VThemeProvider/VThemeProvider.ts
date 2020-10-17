import { defineComponent, h } from 'vue'
import { useTheme } from '../../composables/theme'
import './VThemeProvider.sass'

export const VThemeProvider = defineComponent({
  props: {
    theme: {
      type: String,
    },
  },
  setup (props, { slots }) {
    const { themeClass } = useTheme(props)

    return () => h('div', {
      class: ['v-theme-provider', themeClass.value],
    }, slots.default?.())
  },
})
