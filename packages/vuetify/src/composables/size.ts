// Setup
import { computed } from 'vue'
import propsFactory from '@/util/propsFactory'

// Types
import type { Prop } from 'vue'

const allowedSizes = ['x-small', 'small', 'default', 'large', 'x-large'] as const

type Size = typeof allowedSizes[number]

export interface SizeProps {
  size?: Size
}

// Props
export const makeSizeProps = propsFactory({
  size: {
    type: String,
    default: 'default',
  } as Prop<Size>,
})

// Effect
export function useSizeClass (props: SizeProps) {
  const sizeClass = computed(() => {
    if (!props.size) return 'v-size--default'
    else if (!allowedSizes.includes(props.size)) return null

    return `v-size--${props.size}`
  })

  return { sizeClass }
}
