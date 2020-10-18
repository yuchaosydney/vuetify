import { randomHexColor } from '../../util/helpers'
import { defineComponent, h } from 'vue'
import { useLayout } from './VLayout'

export const VAppBar = defineComponent({
  name: 'VAppBar',
  props: {
    height: {
      type: Number,
      default: 48,
    },
    id: String,
  },
  setup (props, { slots }) {
    const { layer } = useLayout(props, 'top')

    const background = randomHexColor()

    return () => h('div', {
      style: {
        position: 'absolute',
        background,
        height: `${props.height}px`,
        width: `calc(100% - ${layer.value.layer.left}px - ${layer.value.layer.right}px)`,
        marginTop: `${layer.value.layer.top}px`,
        marginLeft: `${layer.value.layer.left}px`,
        marginRight: `${layer.value.layer.right}px`,
        transition: 'all 0.3s ease-in-out',
        zIndex: layer.value.zIndex,
      },
    }, slots.default?.())
  },
})
