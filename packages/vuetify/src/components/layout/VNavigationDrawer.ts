import { uuid, randomHexColor } from '../../util/helpers'
import { defineComponent, h, onBeforeUnmount, ref, watch } from 'vue'
import { useLayout } from './VLayout'

export const VNavigationDrawer = defineComponent({
  name: 'VNavigationDrawer',
  props: {
    zOrder: Number,
    width: {
      type: Number,
      default: 300,
    },
    right: Boolean,
    id: String,
  },
  setup (props, { slots }) {
    const values = useLayout(props, props.right ? 'right' : 'left')

    const background = randomHexColor()

    return () => h('div', {
      style: {
        background,
        position: 'fixed',
        width: `${props.width}px`,
        height: `calc(100% - ${values.value.top}px - ${values.value.bottom}px)`,
        left: props.right ? undefined : 0,
        right: props.right ? 0 : undefined,
        marginTop: `${values.value.top}px`,
        marginBottom: `${values.value.bottom}px`,
        marginLeft: props.right ? undefined : `${values.value.left}px`,
        marginRight: props.right ? `${values.value.right}px` : undefined,
      },
    }, slots.default!())
  },
})
