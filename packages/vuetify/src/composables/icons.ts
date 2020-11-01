// Utilities
import { markRaw } from 'vue'
import { useVuetify } from '@/framework'

// Types
import type { Component } from 'vue'

export type VuetifyIconComponent = {
  component: Component | string
  props?: object
}

export type VuetifyIcon = string | VuetifyIconComponent

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

export type InternalIcon = {
  component: undefined
  props: undefined
  name: string
  type: string
  isSvg: boolean
  isMaterialIcon: boolean
  isFontAwesome5: boolean
} | { component: Component, props?: object }

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

export const useIcons = () => {
  const vuetify = useVuetify()

  // return vuetify.icons
  return {
    get: (iconName: string): InternalIcon => {
      if (iconName.startsWith('$')) {
        const icon = vuetify.icons[iconName.slice(1)]

        if (!icon) throw new Error(`Could not find icon ${iconName}`)

        if (typeof icon === 'string') {
          iconName = icon
        } else if (typeof icon.component === 'string') {
          iconName = icon.component
        } else {
          return icon as { component: Component, props: object }
        }
      }

      const svg = isSvgPath(iconName)
      const materialIcon = !svg && isMaterialIcon(iconName)
      const fontAwesome5 = !materialIcon && isFontAwesome5(iconName)

      return {
        component: undefined,
        props: undefined,
        name: iconName,
        type: !svg ? iconName.slice(0, iconName.indexOf('-')) : '',
        isSvg: svg,
        isMaterialIcon: materialIcon,
        isFontAwesome5: fontAwesome5,
      }
    },
    set: (iconName: keyof VuetifyIcons, icon: VuetifyIcon) => {
      if (typeof icon !== 'string' && typeof icon.component !== 'string') {
        vuetify.icons[iconName] = {
          component: markRaw(icon.component),
          props: icon.props,
        }
      } else {
        vuetify.icons[iconName] = icon
      }
    },
  }
}
