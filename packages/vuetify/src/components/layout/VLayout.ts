import { defineComponent, h, InjectionKey, inject, provide, computed, Ref, ref, Prop, onBeforeUnmount } from 'vue'

export const VuetifyLayoutKey: InjectionKey<any> = Symbol.for('vuetify-layout')

export const useLayout = (id: string, amount: Ref<number>, position: 'top' | 'bottom' | 'left' | 'right') => {
  const layout = inject(VuetifyLayoutKey)

  if (!layout) throw new Error('No layout!')

  const styles = layout.register(position, id, amount)

  onBeforeUnmount(() => layout.unregister(id))

  return styles
}

type Position = 'top' | 'left' | 'right' | 'bottom'

interface LayoutValue {
  id: string
  position: Position
  // amount: number
}

const generateLayers = (layout: string[], registered: string[], positions: Map<string, Position>, amounts: Map<string, Ref<number>>) => {
  let previousLayer = { top: 0, left: 0, right: 0, bottom: 0 }
  const layers = [{ id: '', layer: { ...previousLayer } }]
  for (const id of layout.map(l => l.split(':')[0]).filter(l => registered.includes(l))) {
    const position = positions.get(id)
    const amount = amounts.get(id)
    if (!position || !amount) continue

    const layer = {
      ...previousLayer,
      [position]: previousLayer[position] + amount.value,
    }

    layers.push({
      id,
      layer,
    })

    previousLayer = layer
  }

  return layers
}

export const createLayout = (layout: Ref<string[]>) => {
  // const entries = ref(new Map<string, LayoutValue>())
  const registered = ref<string[]>([])
  const positions = new Map<string, Position>()
  const amounts = new Map<string, Ref<number>>()

  const overlaps = computed(() => {
    const map = new Map<string, { position: Position, amount: number }>()
    for (const h of layout.value.filter(item => item.indexOf(':') >= 0)) {
      const [top, bottom] = h.split(':')
      const topPosition = positions.get(top)
      const bottomPosition = positions.get(bottom)
      const topAmount = amounts.get(top)
      const bottomAmount = amounts.get(bottom)

      if (!topPosition || !bottomPosition || !topAmount || !bottomAmount) continue

      map.set(bottom, { position: topPosition, amount: topAmount.value })
      map.set(top, { position: bottomPosition, amount: -bottomAmount.value })
    }

    return map
  })

  const layers = computed(() => {
    return generateLayers(layout.value, registered.value, positions, amounts)
  })

  const padding = computed(() => {
    const layer = layers.value[layers.value.length - 1].layer
    return `${layer.top}px ${layer.right}px ${layer.bottom}px ${layer.left}px`
  })

  provide(VuetifyLayoutKey, {
    register: (position: LayoutValue['position'], id: string, amount: Ref<number>) => {
      positions.set(id, position)
      amounts.set(id, amount)
      registered.value.push(id)

      return computed(() => {
        const index = layers.value.findIndex(l => l.id === id)
        const item = layers.value[index - 1]

        const overlap = overlaps.value.get(id)
        if (overlap) {
          item.layer[overlap.position] += overlap.amount
        }

        const isHorizontal = position === 'left' || position === 'right'
        const isOpposite = position === 'right'

        const amount = amounts.get(id)

        return {
          width: !isHorizontal ? `calc(100% - ${item.layer.left}px - ${item.layer.right}px)` : `${amount?.value || 0}px`,
          height: isHorizontal ? `calc(100% - ${item.layer.top}px - ${item.layer.bottom}px)` : `${amount?.value || 0}px`,
          marginLeft: isOpposite ? undefined : `${item.layer.left}px`,
          marginRight: isOpposite ? `${item.layer.right}px` : undefined,
          marginTop: `${item.layer.top}px`,
          marginBottom: `${item.layer.bottom}px`,
          zIndex: layers.value.length - index,
        }
      })
    },
    unregister: (id: string) => {
      positions.delete(id)
      amounts.delete(id)
      registered.value = registered.value.filter(v => v !== id)
    },
    padding,
  })
}

export const VLayout = defineComponent({
  name: 'VLayout',
  props: {
    layout: {
      type: Array,
      required: true,
    } as Prop<string[]>,
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
        zIndex: 0,
      },
    }, slots.default?.())
  },
})
