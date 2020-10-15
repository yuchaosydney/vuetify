import { defineComponent, h, InjectionKey, inject, provide, computed, Ref, ref, Prop, onBeforeUnmount } from 'vue'

export const VuetifyLayoutKey: InjectionKey<any> = Symbol.for('vuetify-layout')

export const useLayout = (props: { id?: string, height?: number, width?: number }, position: 'top' | 'bottom' | 'left' | 'right') => {
  const layout = inject(VuetifyLayoutKey)

  if (!layout) throw new Error('No layout!')
  console.log(props.id, position)
  const values = layout.register(position, props.id, position === 'top' || position === 'bottom' ? props.height : props.width)
  onBeforeUnmount(() => layout.unregister(props.id))

  return values
}

interface LayoutValue {
  id: string
  position: 'top' | 'left' | 'right' | 'bottom'
  value: number
}

export const createLayout = (history: Ref<string[]>) => {
  const entries = ref(new Map<string, LayoutValue>())

  const getValues = (history: string[], values: Map<string, LayoutValue>, overlaps: Map<string, LayoutValue>, lastId?: string) => {
    let obj = { top: 0, left: 0, right: 0, bottom: 0 }
    const arr = lastId ? history.slice(0, history.indexOf(lastId)) : history
    for (const h of arr) {
      const [id] = h.split(':')
      console.log(lastId, id)
      const layout = values.get(id)
      if (!layout) continue

      obj = {
        ...obj,
        [layout.position]: obj[layout.position] + layout.value,
      }
    }

    return obj
  }

  const overlaps = computed(() => {
    const map = new Map<string, LayoutValue>()
    for (const h of history.value.filter(item => item.indexOf(':') >= 0)) {
      const [top, bottom] = h.split(':')
      const topLayout = entries.value.get(top)
      const bottomLayout = entries.value.get(bottom)

      if (!topLayout || !bottomLayout) continue

      map.set(bottomLayout.id, { id: bottomLayout.id, position: topLayout.position, value: topLayout.value })
      map.set(topLayout.id, { id: topLayout.id, position: bottomLayout.position, value: -bottomLayout.value })
    }

    return map
  })

  const computedValues = computed(() => {
    return getValues(history.value, entries.value, new Map())
  })

  provide(VuetifyLayoutKey, {
    register: (position: LayoutValue['position'], id: string, value: number, zOrder: number) => {
      entries.value.set(id, { id, position, value })

      return computed(() => {
        const values = getValues(history.value, entries.value, overlaps.value, id)

        const overlap = overlaps.value.get(id)
        if (overlap) {
          console.log('found overlap')
          values[overlap.position] += overlap.value
        }

        return values
      })
    },
    update: (id: string, value: number) => {
      const curr = entries.value.get(id)
      if (!curr) return
      entries.value.set(id, { ...curr, value })
    },
    unregister: (id: string) => {
      entries.value.delete(id)
    },
    values: computedValues,
  })
}

export const VLayout = defineComponent({
  name: 'VLayout',
  props: {
    layout: Array as Prop<string[]>,
  },
  setup (props, { slots }) {
    const layout = computed(() => props.layout || [])
    createLayout(layout)
    return () => h('div', {
      style: {
        display: 'flex',
        flex: '1 1 auto',
        minHeight: '100vh',
      },
    }, slots.default!())
  },
})
