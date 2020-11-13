// Utilities
import { computed } from 'vue'
import { useVuetify } from '@/framework'

// Types
import type { Component } from 'vue'

export type VuetifyIcon = string | Component

export interface VuetifyIcons {
  [name: string]: VuetifyIcon
  complete: VuetifyIcon
  cancel: VuetifyIcon
  close: VuetifyIcon
  delete: VuetifyIcon
  clear: VuetifyIcon
  success: VuetifyIcon
  info: VuetifyIcon
  warning: VuetifyIcon
  error: VuetifyIcon
  prev: VuetifyIcon
  next: VuetifyIcon
  checkboxOn: VuetifyIcon
  checkboxOff: VuetifyIcon
  checkboxIndeterminate: VuetifyIcon
  delimiter: VuetifyIcon
  sort: VuetifyIcon
  expand: VuetifyIcon
  menu: VuetifyIcon
  subgroup: VuetifyIcon
  dropdown: VuetifyIcon
  radioOn: VuetifyIcon
  radioOff: VuetifyIcon
  edit: VuetifyIcon
  ratingEmpty: VuetifyIcon
  ratingFull: VuetifyIcon
  ratingHalf: VuetifyIcon
  loading: VuetifyIcon
  first: VuetifyIcon
  last: VuetifyIcon
  unfold: VuetifyIcon
  file: VuetifyIcon
  plus: VuetifyIcon
  minus: VuetifyIcon
}

export interface IconInstance {
  component?: Component
  icons: VuetifyIcons
}

export type IconOptions = Partial<IconInstance>

export type InternalIcon = {
  component: Component | undefined
  props: {
    [key: string]: unknown
    icon: string
  }
  name: string
  type: string
  isSvg: boolean
  isMaterialIcon: boolean
  isFontAwesome5: boolean
}

function isFontAwesome5 (iconType: string): boolean {
  return ['fas', 'far', 'fal', 'fab', 'fad'].some(val => iconType.includes(val))
}

function isSvgPath (icon: string): boolean {
  return (/^[mzlhvcsqta]\s*[-+.0-9][^mlhvzcsqta]+/i.test(icon) && /[\dz]$/i.test(icon) && icon.length > 4)
}

// Material Icon delimiter is _
// https://material.io/icons/
function isMaterialIcon (iconName: string) {
  const delimiterIndex = iconName.indexOf('-')
  return delimiterIndex <= -1
}

export const useIcon = (props: { icon: string }) => {
  const icon = computed(() => {
    const vuetify = useVuetify()
    let icon = props.icon
    let component: Component | undefined = vuetify.icon.component

    if (props.icon.startsWith('$')) {
      const lookup = vuetify.icon.icons[props.icon.slice(1)]

      if (!lookup) throw new Error(`Could not find icon ${props.icon}`)

      if (typeof lookup === 'string') {
        icon = lookup
      } else {
        icon = props.icon
        component = lookup
      }
    }

    const svg = isSvgPath(icon)
    const materialIcon = !svg && isMaterialIcon(icon)
    const fontAwesome5 = !materialIcon && isFontAwesome5(icon)

    return {
      component,
      props: { icon },
      name: icon,
      type: !svg && !component ? icon.slice(0, icon.indexOf('-')) : '',
      isSvg: svg,
      isMaterialIcon: materialIcon,
      isFontAwesome5: fontAwesome5,
    }
  })

  return { icon }
}
