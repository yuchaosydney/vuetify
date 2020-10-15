import { randomHexColor } from '../../util/helpers'
import { defineComponent, h } from 'vue'
import { useLayout } from './VLayout'

export const VAppBar = defineComponent({
  name: 'VAppBar',
  props: {
    zOrder: Number,
    height: {
      type: Number,
      default: 48,
    },
    id: String,
  },
  setup (props, { slots }) {
    const values = useLayout(props, 'top')

    const background = randomHexColor()

    return () => h('div', {
      style: {
        position: 'fixed',
        background,
        height: `${props.height}px`,
        width: `calc(100% - ${values.value.left}px - ${values.value.right}px)`,
        marginTop: `${values.value.top}px`,
        marginLeft: `${values.value.left}px`,
        marginRight: `${values.value.right}px`,
      },
    }, slots.default!())
  },
})
