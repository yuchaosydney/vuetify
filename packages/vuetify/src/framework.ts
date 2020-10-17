import { inject } from 'vue'
import { VuetifyThemeSymbol, createTheme } from './composables'

// Types
import type { InjectionKey, App } from 'vue'

export interface VuetifyComponentDefaults {
  [key: string]: Record<string, unknown>
  global: Record<string, unknown>
}

export interface VuetifyInstance {
  defaults: VuetifyComponentDefaults
}

export interface VuetifyOptions {
  components?: Record<string, any>
  directives?: Record<string, any>
  defaults?: Partial<VuetifyComponentDefaults>
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
    }

    app.provide(VuetifySymbol, vuetify)
    app.config.globalProperties.$vuetify = vuetify
    app.provide(VuetifyThemeSymbol, createTheme({
      defaultTheme: 'light',
      themes: {
        light: {
          background: '#ffffff',
          error: '#ff0000',
          warning: '#ffff00',
          info: '#0000ff',
          success: '#00ff00',
          primary: '#ff0000',
          primaryVariant: '#ff00ff',
          secondary: '#0000ff',
          secondaryVariant: '#4444ff',
          surface: '#ffffff',
          inverseText: '#ffffff',
          text: '#000000',
        },
        dark: {
          background: '#222222',
          error: '#ff0000',
          warning: '#ffff00',
          info: '#0000ff',
          success: '#00ff00',
          primary: '#ff00ff',
          primaryVariant: '#33ff33',
          secondary: '#555500',
          secondaryVariant: '#4444ff',
          surface: '#ffffff',
          inverseText: '#000000',
          text: '#ffffff',
        },
        contrast: {
          background: '#000000',
          surface: '#000000',
          primary: '#eeeeee',
          primaryVariant: '#eeeeee',
          secondary: '#ffff00',
          secondaryVariant: '#ffff00',
          text: '#ffffff',
          inverseText: '#000000',
          error: '#ff0000',
          warning: '#ffff00',
          info: '#0000ff',
          success: '#00ff00',
        },
      },
    }))
  }

  return { install }
}
