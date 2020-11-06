// Utilities
import { defineComponent, onBeforeMount, proxyRefs } from 'vue'
import { useActiveClass, useGroupItem } from '@/composables'
import { consoleError } from '@/util/console'
import makeProps from '@/util/makeProps'

export const VItem = defineComponent({
  name: 'VItem',

  props: makeProps({
    activeClass: String,
    disabled: Boolean,
    value: {
      required: false,
    },
  }),

  setup (props, context) {
    const item = useGroupItem(props, Symbol.for('v-item-group'))
    const activeClass = useActiveClass(props, Symbol.for('v-item-group-active-class'))

    onBeforeMount(() => {
      if (!context.slots.default) consoleError('v-item is missing a default slot')
    })

    return () => context.slots.default?.({
      ...proxyRefs(item),
      isDisabled: props.disabled,
      activeClass: item.isSelected.value ? activeClass.value : undefined,
    })
  },
})
