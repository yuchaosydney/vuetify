import { defineComponent, h, InjectionKey, inject, provide, computed, Ref, ref, Prop, onBeforeUnmount } from 'vue'

export const VuetifyLayoutKey: InjectionKey<any> = Symbol.for('vuetify-layout')

export const useLayout = (id: string, amount: Ref<number>, position: 'top' | 'bottom' | 'left' | 'right') => {
  const layout = inject(VuetifyLayoutKey)

  if (!layout) throw new Error('No layout!')

  const styles = layout.register(position, id, amount)

  onBeforeUnmount(() => layout.unregister(id))

  return styles
}

interface LayoutValue {
  id: string
  position: 'top' | 'left' | 'right' | 'bottom'
  amount: number
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
      [layout.position]: previousLayer[layout.position] + layout.amount,
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

      map.set(bottomLayout.id, { id: bottomLayout.id, position: topLayout.position, amount: topLayout.amount })
      map.set(topLayout.id, { id: topLayout.id, position: bottomLayout.position, amount: -bottomLayout.amount })
    }

    return map
  })

  const layers = computed(() => {
    return generateLayers(history.value, entries.value)
  })

  const padding = computed(() => {
    const layer = layers.value[layers.value.length - 1].layer
    return `${layer.top}px ${layer.right}px ${layer.bottom}px ${layer.left}px`
  })

  provide(VuetifyLayoutKey, {
    register: (position: LayoutValue['position'], id: string, amount: Ref<number>) => {
      entries.value.set(id, { id, position, amount: amount as any as number })

      return computed(() => {
        const index = layers.value.findIndex(l => l.id === id)
        const item = layers.value[index - 1]

        const overlap = overlaps.value.get(id)
        if (overlap) {
          console.log('found overlap')
          item.layer[overlap.position] += overlap.amount
        }

        const isHorizontal = position === 'left' || position === 'right'
        const isOpposite = position === 'right'

        return {
          width: !isHorizontal ? `calc(100% - ${item.layer.left}px - ${item.layer.right}px)` : `${entries.value.get(id)?.amount}px`,
          height: isHorizontal ? `calc(100% - ${item.layer.top}px - ${item.layer.bottom}px)` : `${entries.value.get(id)?.amount}px`,
          marginLeft: isOpposite ? undefined : `${item.layer.left}px`,
          marginRight: isOpposite ? `${item.layer.right}px` : undefined,
          marginTop: `${item.layer.top}px`,
          marginBottom: `${item.layer.bottom}px`,
          zIndex: item.zIndex,
        }
      })
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
