import { randomHexColor } from '../../util/helpers'
import { computed, defineComponent, h } from 'vue'
import { useLayout } from './VLayout'

export const VAppBar = defineComponent({
  name: 'VAppBar',
  props: {
    modelValue: {
      type: Boolean,
      default: true,
    },
    height: {
      type: Number,
      default: 48,
    },
    id: {
      type: String,
      required: true,
    },
  },
  setup (props, { slots }) {
    const styles = useLayout(props.id, computed(() => props.modelValue ? props.height : 0), 'top')
    const background = randomHexColor()

    return () => h('div', {
      style: {
        position: 'absolute',
        background,
        transition: 'all 0.3s ease-in-out',
        ...styles.value,
        transform: `translateY(${props.modelValue ? 0 : -100}%)`,
        height: `${props.height}px`,
      },
    }, slots.default?.())
  },
})
