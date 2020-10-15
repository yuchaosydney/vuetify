import { randomHexColor } from '../../util/helpers'
import { computed, defineComponent, h, inject } from 'vue'
import { VuetifyLayoutKey } from './VLayout'

export const VContent = defineComponent({
  name: 'VContent',
  setup (_, { slots }) {
    const layout = inject(VuetifyLayoutKey)

    const padding = computed(() => `${layout.values.value.top}px 0 0 ${layout.values.value.left}px`)

    const background = randomHexColor()

    return () => h('div', {
      style: {
        padding: padding.value,
        display: 'flex',
        flex: '1 0 auto',
        width: '100%',
        background,
        flexDirection: 'column',
      },
    }, slots.default!())
  },
})
