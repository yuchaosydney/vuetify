// Styles
import './VApp.sass'

import { defineComponent, h } from 'vue'
import VThemeProvider from '../VThemeProvider'

export default defineComponent({
  name: 'VApp',
  props: {
    theme: String,
  },
  setup (props, { slots }) {
    return () => (
      h(VThemeProvider, {
        ...props,
        class: 'v-application',
        'data-app': true,
      }, () => h('div', { class: 'v-application__wrap' }, slots.default?.()))
    )
  },
})
