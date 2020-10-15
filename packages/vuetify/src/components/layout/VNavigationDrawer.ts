import { uuid, randomHexColor } from '../../util/helpers'
import { defineComponent, h, onBeforeUnmount, ref, watch } from 'vue'
import { useLayout } from './VLayout'

export const VNavigationDrawer = defineComponent({
  name: 'VNavigationDrawer',
  props: {
    zOrder: Number,
    width: Number,
    right: Boolean,
  },
  setup (props, { slots }) {
    const layout = useLayout()

    const width = ref(props.width || 300)
    const id = 'nav' + uuid()

    let values = layout.register(props.right ? 'right' : 'left', id, width, props.zOrder)

    onBeforeUnmount(() => layout.unregister(id))

    watch(() => props.zOrder, () => {
      layout.unregister(id)
      values = layout.register(props.right ? 'right' : 'left', id, width, props.zOrder)
    })

    const background = randomHexColor()

    return () => h('div', {
      style: {
        background,
        position: 'fixed',
        width: `${width.value}px`,
        height: `calc(100% - ${values.value.top}px - ${values.value.bottom}px)`,
        left: props.right ? undefined : 0,
        right: props.right ? 0 : undefined,
        marginTop: `${values.value.top}px`,
        marginLeft: props.right ? undefined : `${values.value.left}px`,
        marginRight: props.right ? `${values.value.right}px` : undefined,
      },
    }, slots.default!())
  },
})
