import { randomHexColor, uuid } from '../../util/helpers'
import { defineComponent, h, ref } from 'vue'
import { useLayout } from './VLayout'

export const VFooter = defineComponent({
  name: 'VFooter',
  props: {
    zOrder: Number,
    height: Number,
  },
  setup (props, { slots }) {
    const layout = useLayout()
    const id = uuid()
    const height = ref(props.height || 48)
    const values = layout.register('bottom', id, height, props.zOrder)
    const background = randomHexColor()
    console.log(values)

    return () => h('div', {
      style: {
        position: 'fixed',
        width: `calc(100% - ${values.value.left}px - ${values.value.right}px)`,
        height: `${height.value}px`,
        background,
        bottom: 0,
        marginBottom: `${values.value.bottom}px`,
        marginLeft: `${values.value.left}px`,
        marginRight: `${values.value.right}px`,
      },
    }, slots.default!())
  },
})
