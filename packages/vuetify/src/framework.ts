import { inject, reactive } from 'vue'
import mdi from './services/icons/presets/mdi'

// Types
import type { InjectionKey, App } from 'vue'
import type { VuetifyIcons } from './composables/icons'

export interface VuetifyComponentDefaults {
  [key: string]: Record<string, unknown>
  global: Record<string, unknown>
}

export interface VuetifyInstance {
  defaults: VuetifyComponentDefaults
  icons: VuetifyIcons
}

export interface VuetifyOptions {
  components?: Record<string, any>
  directives?: Record<string, any>
  defaults?: Partial<VuetifyComponentDefaults>
  icons?: Partial<VuetifyIcons>
}

export const VuetifySymbol: InjectionKey<VuetifyInstance> = Symbol.for('vuetify')

export const useVuetify = () => {
  const vuetify = inject(VuetifySymbol)

  if (!vuetify) {
    throw new Error('Vuetify has not been installed on this app')
  }

  return vuetify
}

export const createVuetify = (options: VuetifyOptions = {}) => {
  const install = (app: App) => {
    const {
      components = {},
      directives = {},
      defaults = {},
      icons = {},
    } = options

    for (const key in directives) {
      const directive = directives[key]

      app.directive(key, directive)
    }

    for (const key in components) {
      const component = components[key]

      app.component(key, component)
    }

    const vuetify: VuetifyInstance = {
      defaults: {
        global: {},
        ...defaults,
      },
      icons: reactive({
        ...mdi,
        ...icons as VuetifyIcons,
      }),
    }

    app.provide(VuetifySymbol, vuetify)
    app.config.globalProperties.$vuetify = vuetify
  }

  return { install }
}
