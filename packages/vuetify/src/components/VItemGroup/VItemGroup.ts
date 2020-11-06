// Styles
import './VItemGroup.sass'

// Utilities
import { defineComponent, h, onBeforeMount } from 'vue'
import { useGroup, createActiveClass } from '@/composables'
import { consoleWarn } from '@/util/console'
import makeProps from '@/util/makeProps'

export const VItemGroup = defineComponent({
  name: 'VItemGroup',

  props: makeProps({
    activeClass: {
      type: String,
      default: 'v-item--active',
    },
    mandatory: Boolean,
    max: Number,
    multiple: Boolean,
    modelValue: {
      required: false,
    },
  }),

  setup (props, context) {
    useGroup(props, context, Symbol.for('v-item-group'))
    createActiveClass(props, Symbol.for('v-item-group-active-class'))

    onBeforeMount(() => {
      if (props.multiple && props.modelValue !== 'undefined' && !Array.isArray(props.modelValue)) {
        consoleWarn('v-item-group modelValue must be an array when using multiple prop')
      }
    })

    return () => h('div', {
      class: [
        'v-item-group',
        // theme?
      ],
    }, [context.slots.default?.()])
  },
})
