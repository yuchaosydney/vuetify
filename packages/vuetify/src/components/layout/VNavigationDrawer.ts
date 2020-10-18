import { computed, defineComponent, h } from 'vue'
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
    id: {
      type: String,
      required: true,
    },
  },
  setup (props, { slots }) {
    const width = computed(() => props.modelValue ? props.width : 0)
    const styles = useLayout(props.id, width, props.right ? 'right' : 'left')
    const background = randomHexColor()

    return () => h('div', {
      style: {
        background,
        position: 'absolute',
        left: props.right ? undefined : 0,
        right: props.right ? 0 : undefined,
        transition: 'all 0.3s ease-in-out',
        transform: `translateX(${props.modelValue ? 0 : props.right ? 100 : -100}%)`,
        ...styles.value,
        width: `${props.width}px`,
      },
    }, slots.default?.())
  },
})
