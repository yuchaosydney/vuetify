// Utilities
import { computed, inject, provide, toRef } from 'vue'

// Types
import type { InjectionKey, Ref } from 'vue'

type ActiveClassProvide = Ref<string | undefined>

export const createActiveClass = (props: { activeClass?: string }, injectKey: InjectionKey<ActiveClassProvide>) => {
  provide(injectKey, toRef(props, 'activeClass'))
}

export const useActiveClass = (props: { activeClass?: string }, injectKey: InjectionKey<ActiveClassProvide>) => {
  const activeClass = inject(injectKey)

  return computed(() => props.activeClass ?? activeClass?.value)
}
