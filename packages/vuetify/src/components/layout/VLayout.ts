import { defineComponent, h, InjectionKey, inject, provide, computed, Ref, ref, Prop, onBeforeUnmount, watch } from 'vue'

export const VuetifyLayoutKey: InjectionKey<any> = Symbol.for('vuetify-layout')

export const useLayout = (props: { id?: string, height?: number, width?: number }, position: 'top' | 'bottom' | 'left' | 'right') => {
  const layout = inject(VuetifyLayoutKey)

  if (!layout) throw new Error('No layout!')

  const size = computed(() => position === 'top' || position === 'bottom' ? props.height : props.width)
  const layer = layout.register(position, props.id, size.value)

  watch(size, v => layout.update(props.id, v))
  onBeforeUnmount(() => layout.unregister(props.id))

  return { layer, update: (v: number) => layout.update(props.id, v) }
}

interface LayoutValue {
  id: string
  position: 'top' | 'left' | 'right' | 'bottom'
  value: number
}

const generateLayers = (history: string[], values: Map<string, LayoutValue>) => {
  let previousLayer = { top: 0, left: 0, right: 0, bottom: 0 }
  const layers = [{ id: '', zIndex: 0, layer: { ...previousLayer } }]
  for (const [i, h] of history.entries()) {
    const [id] = h.split(':')
    const layout = values.get(id)
    if (!layout) continue

    const layer = {
      ...previousLayer,
      [layout.position]: previousLayer[layout.position] + layout.value,
    }

    layers.push({
      id,
      zIndex: history.length - i,
      layer,
    })

    previousLayer = layer
  }

  return layers
}

export const createLayout = (history: Ref<string[]>) => {
  const entries = ref(new Map<string, LayoutValue>())

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

  const layers = computed(() => {
    return generateLayers(history.value, entries.value)
  })

  const padding = computed(() => layers.value[layers.value.length - 1].layer)

  provide(VuetifyLayoutKey, {
    register: (position: LayoutValue['position'], id: string, value: number, zOrder: number) => {
      entries.value.set(id, { id, position, value })

      return computed(() => {
        const index = layers.value.findIndex(l => l.id === id)
        const layer = layers.value[index - 1]

        const overlap = overlaps.value.get(id)
        if (overlap) {
          console.log('found overlap')
          layer.layer[overlap.position] += overlap.value
        }

        return layer
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
    padding,
  })
}

export const VLayout = defineComponent({
  name: 'VLayout',
  props: {
    layout: Array as Prop<string[]>,
    fullHeight: Boolean,
  },
  setup (props, { slots }) {
    const layout = computed(() => props.layout || [])
    createLayout(layout)
    return () => h('div', {
      style: {
        position: 'relative',
        display: 'flex',
        flex: '1 1 auto',
        height: props.fullHeight ? '100vh' : undefined,
        overflow: 'hidden',
      },
    }, slots.default?.())
  },
})
