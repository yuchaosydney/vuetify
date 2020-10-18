import { defineComponent, h, watch } from 'vue'
import { randomHexColor } from '../../util/helpers'
import { useLayout } from './VLayout'

export const VNavigationDrawer = defineComponent({
  name: 'VNavigationDrawer',
  props: {
    modelValue: {
      type: Boolean,
      default: true,
    },
    width: {
      type: Number,
      default: 300,
    },
    right: Boolean,
    id: String,
  },
  setup (props, { slots }) {
    const { layer, update } = useLayout(props, props.right ? 'right' : 'left')

    const background = randomHexColor()

    watch(() => props.modelValue, show => update(show ? props.width : 0))

    return () => h('div', {
      style: {
        background,
        position: 'absolute',
        width: `${props.width}px`,
        height: `calc(100% - ${layer.value.layer.top}px - ${layer.value.layer.bottom}px)`,
        left: props.right ? undefined : 0,
        right: props.right ? 0 : undefined,
        marginTop: `${layer.value.layer.top}px`,
        marginBottom: `${layer.value.layer.bottom}px`,
        marginLeft: props.right ? undefined : `${layer.value.layer.left}px`,
        marginRight: props.right ? `${layer.value.layer.right}px` : undefined,
        transition: 'all 0.3s ease-in-out',
        transform: `translateX(${props.modelValue ? 0 : -100}%)`,
        zIndex: layer.value.zIndex,
      },
    }, slots.default?.())
  },
})
