import { randomHexColor } from '../../util/helpers'
import { defineComponent, h } from 'vue'
import { useLayout } from './VLayout'

export const VFooter = defineComponent({
  name: 'VFooter',
  props: {
    height: {
      type: Number,
      default: 48,
    },
    id: String,
  },
  setup (props, { slots }) {
    const { layer } = useLayout(props, 'bottom')
    const background = randomHexColor()

    return () => h('div', {
      style: {
        position: 'absolute',
        width: `calc(100% - ${layer.value.left}px - ${layer.value.right}px)`,
        height: `${props.height}px`,
        background,
        bottom: 0,
        marginBottom: `${layer.value.bottom}px`,
        marginLeft: `${layer.value.left}px`,
        marginRight: `${layer.value.right}px`,
        transition: 'all 0.3s ease-in-out',
        zIndex: layer.value.zIndex,
      },
    }, slots.default?.())
  },
})
