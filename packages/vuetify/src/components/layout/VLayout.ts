import { defineComponent, h, InjectionKey, inject, provide, computed, Ref, ref } from 'vue'

export const VuetifyLayoutKey: InjectionKey<any> = Symbol.for('vuetify-layout')

export const useLayout = () => {
  const layout = inject(VuetifyLayoutKey)

  if (!layout) throw new Error('No layout!')

  return layout
}

interface LayoutValue {
  id: string
  position: 'top' | 'left' | 'right' | 'bottom'
  value: Ref<number>
}

export const createLayout = () => {
  const history = ref<string[]>([])

  const values = new Map<string, LayoutValue>()

  const getValues = (history: string[], values: Map<string, LayoutValue>, lastId?: string) => {
    let obj = { top: 0, left: 0, right: 0, bottom: 0 }
    const arr = lastId ? history.slice(0, history.indexOf(lastId)) : history
    for (const h of arr) {
      const layout = values.get(h)
      if (!layout) continue
      obj = {
        ...obj,
        [layout.position]: obj[layout.position] + layout.value.value,
      }
    }

    return obj
  }

  const computedValues = computed(() => {
    return getValues(history.value, values)
  })

  provide(VuetifyLayoutKey, {
    register: (position: LayoutValue['position'], id: string, value: Ref<number>, zOrder: number) => {
      values.set(id, { id, position, value })
      const arr = history.value.slice()
      arr.splice(zOrder, 0, id)
      history.value = arr

      return computed(() => getValues(history.value, values, id))
    },
    unregister: (id: string) => {
      values.delete(id)
      history.value = history.value.filter(h => h !== id)
    },
    values: computedValues,
  })
}

export const VLayout = defineComponent({
  name: 'VLayout',
  setup (_, { slots }) {
    createLayout()
    return () => h('div', {
      style: {
        display: 'flex',
        flex: '1 1 auto',
        minHeight: '100vh',
      },
    }, slots.default!())
  },
})
