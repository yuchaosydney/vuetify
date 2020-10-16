import { randomHexColor } from '../../util/helpers'
import { defineComponent, h } from 'vue'
import { useLayout } from './VLayout'

export const VFooter = defineComponent({
  name: 'VFooter',
  props: {
    zOrder: Number,
    height: {
      type: Number,
      default: 48,
    },
    id: String,
  },
  setup (props, { slots }) {
    const values = useLayout(props, 'bottom')
    const background = randomHexColor()

    return () => h('div', {
      style: {
        position: 'fixed',
        width: `calc(100% - ${values.value.left}px - ${values.value.right}px)`,
        height: `${props.height}px`,
        background,
        bottom: 0,
        marginBottom: `${values.value.bottom}px`,
        marginLeft: `${values.value.left}px`,
        marginRight: `${values.value.right}px`,
        transition: 'all 1s linear',
      },
    }, slots.default!())
  },
})
