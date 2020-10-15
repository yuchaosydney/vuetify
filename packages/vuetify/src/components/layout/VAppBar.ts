import { randomHexColor, uuid } from '../../util/helpers'
import { computed, defineComponent, h, onBeforeUnmount } from 'vue'
import { useLayout } from './VLayout'

export const VAppBar = defineComponent({
  name: 'VAppBar',
  props: {
    zOrder: Number,
    height: Number,
  },
  setup (props, { slots }) {
    const layout = useLayout()

    const height = computed(() => props.height || 48)
    const id = 'bar' + uuid()

    const values = layout.register('top', id, height, props.zOrder)

    onBeforeUnmount(() => layout.unregister(id))

    const background = randomHexColor()

    return () => h('div', {
      style: {
        position: 'fixed',
        background,
        height: `${height.value}px`,
        width: `calc(100% - ${values.value.left}px - ${values.value.right}px)`,
        marginTop: `${values.value.top}px`,
        marginLeft: `${values.value.left}px`,
        marginRight: `${values.value.right}px`,
      },
    }, slots.default!())
  },
})
