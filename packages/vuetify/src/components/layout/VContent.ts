import { randomHexColor } from '../../util/helpers'
import { computed, defineComponent, h } from 'vue'
import { useLayout } from './VLayout'

export const VContent = defineComponent({
  name: 'VContent',
  setup (_, { slots }) {
    const layout = useLayout()

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
