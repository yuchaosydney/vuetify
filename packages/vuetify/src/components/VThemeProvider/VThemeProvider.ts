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
    const { themeClass, current } = useTheme(props)

    return () => h('div', {
      class: ['v-theme-provider', themeClass.value],
    }, [h('div', [`providing ${current.value} theme`]), slots.default?.()])
  },
})
