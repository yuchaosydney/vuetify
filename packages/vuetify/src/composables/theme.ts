// Utilities
import { capitalize, computed, inject, provide, ref, watch } from 'vue'
import { useVuetify } from '@/framework'
import { colorToInt, colorToRGB, contrastRatio } from '@/util'

// Types
import type { InjectionKey, Ref } from 'vue'

interface BaseColors {
  background: string
  surface: string
  primary: string
  primaryVariant: string
  secondary: string
  secondaryVariant: string
  success: string
  warning: string
  error: string
  info: string
}

interface OnColors {
  onBackground: string
  onSurface: string
  onPrimary: string
  onPrimaryVariant: string
  onSecondary: string
  onSecondaryVariant: string
  onSuccess: string
  onWarning: string
  onError: string
  onInfo: string
}

interface InternalTheme extends BaseColors, OnColors {
  [key: string]: string
}

interface ThemeOption extends BaseColors, Partial<OnColors> {
  [key: string]: string | undefined
}

interface ThemeOptions {
  defaultTheme?: string
  themes?: Record<string, ThemeOption>
}

export interface ThemeInstance {
  themes: Ref<Record<string, InternalTheme>>
  defaultTheme: Ref<string>
  setTheme: (key: string, theme: ThemeOption) => void
}

interface ThemeProvide {
  themeClass: Ref<string>
  current: Ref<string>
  next: () => void
  prev: () => void
  setTheme: (key: string, theme: ThemeOption) => void
}

export const VuetifyThemeSymbol: InjectionKey<ThemeProvide> = Symbol.for('vuetify-theme')

const step = <T>(arr: T[], current: T, steps: number): T => arr[(arr.indexOf(current) + arr.length + steps) % arr.length]

export const provideTheme = (props: { theme?: string } = {}): ThemeProvide => {
  const vuetify = useVuetify()
  const themeProvide = inject(VuetifyThemeSymbol, null)

  const current = ref<string>(props.theme ?? themeProvide?.current.value ?? vuetify.theme.defaultTheme.value)
  const themeClass = computed(() => `theme--${current.value}`)

  watch(() => props.theme, theme => theme && (current.value = theme))

  const next = () => current.value = step(Object.keys(vuetify.theme.themes.value), current.value, 1)
  const prev = () => current.value = step(Object.keys(vuetify.theme.themes.value), current.value, -1)

  const newThemeProvide: ThemeProvide = {
    themeClass,
    current,
    next,
    prev,
    setTheme: vuetify.theme.setTheme,
  }

  provide(VuetifyThemeSymbol, newThemeProvide)

  return newThemeProvide
}

export const useTheme = () => {
  const theme = inject(VuetifyThemeSymbol)

  if (!theme) throw new Error('Could not find vuetify theme provider')

  return theme
}

const defaultThemes: Record<string, ThemeOption> = {
  light: {
    background: '#eeeeee',
    surface: '#aaaaaa',
    primary: '#1976D2',
    primaryVariant: '#83acd4',
    secondary: '#424242',
    secondaryVariant: '#8c8c8c',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
  dark: {
    background: '#555555',
    surface: '#333333',
    primary: '#2196F3',
    primaryVariant: '#33ff33',
    secondary: '#424242',
    secondaryVariant: '#1155ff',
    accent: '#FF4081',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
  contrast: {
    background: '#000000',
    surface: '#222222',
    primary: '#eeeeee',
    primaryVariant: '#ee11ee',
    secondary: '#ffff00',
    secondaryVariant: '#11ffee',
    success: '#00ff00',
    warning: '#ffff00',
    error: '#ff0000',
    info: '#0000ff',
  },
}

export const createTheme = (options?: ThemeOptions): ThemeInstance => {
  const styleEl = ref<HTMLStyleElement | undefined>()
  const defaultTheme = ref<string>(options?.defaultTheme ?? 'light')
  const themes = ref<Record<string, ThemeOption>>(options?.themes ?? defaultThemes)

  const toHex = (v: number) => `#${v.toString(16).repeat(3)}`

  const genOnColor = (color: string) => {
    // naive solution
    const int = colorToInt(color)
    const goal = 8
    let curr = 0
    while (contrastRatio(int, colorToInt(toHex(curr))) < goal && curr < 255) {
      curr += 1
    }
    return toHex(curr)
  }

  const computedThemes = computed(() => {
    return Object.keys(themes.value).reduce((obj, key) => {
      const onColors: (keyof BaseColors)[] = [
        'background',
        'surface',
        'primary',
        'primaryVariant',
        'secondary',
        'secondaryVariant',
        'success',
        'warning',
        'error',
        'info',
      ]
      obj[key] = {
        ...onColors.reduce((curr, color) => {
          const onColor = `on${capitalize(color)}` as keyof OnColors
          curr[onColor] = genOnColor(themes.value[key][color])
          return curr
        }, {} as OnColors),
        ...themes.value[key],
      }
      return obj
    }, {} as Record<string, InternalTheme>)
  })

  const genCssVariables = (name: string) => {
    const theme = computedThemes.value[name]

    if (!theme) throw new Error(`Could not find theme ${name}`)

    const variables: Record<string, string> = {}
    for (const [key, value] of Object.entries(theme)) {
      const rgb = colorToRGB(value!)
      variables[`--v-theme-${key}`] = `${rgb.r},${rgb.g},${rgb.b}`
    }

    return variables
  }

  const genStyleElement = () => {
    if (typeof document === 'undefined' || styleEl.value) return

    const el = document.createElement('style')
    el.type = 'text/css'
    el.id = 'vuetify-theme-stylesheet'

    styleEl.value = el
    document.head.appendChild(styleEl.value)
  }

  const updateStyles = () => {
    genStyleElement()

    const classes = []
    for (const themeName of Object.keys(computedThemes.value)) {
      const variables = []
      for (const [key, value] of Object.entries(genCssVariables(themeName))) {
        variables.push(`\t${key}: ${value};`)
      }
      classes.push(`.theme--${themeName} {\n${variables.join('\n')}\n}`)
    }

    styleEl.value!.innerHTML = classes.join('\n')
  }

  watch(themes, updateStyles, { deep: true, immediate: true })

  return {
    themes: computedThemes,
    defaultTheme,
    setTheme: (key: string, theme: ThemeOption) => themes.value[key] = theme,
  }
}
