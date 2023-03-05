// Utilities
import { propsFactory } from '@/util'

// Types
import type { PropType } from 'vue'

export interface ComponentProps {
  class?: string | any[] | Record<string, any>
  style?: string | any[] | Record<number, any>
}

// Composables
export const makeComponentProps = propsFactory({
  class: [String, Array] as PropType<ComponentProps['class']>,
  style: [String, Array, Object] as PropType<ComponentProps['style']>,
}, 'component')
