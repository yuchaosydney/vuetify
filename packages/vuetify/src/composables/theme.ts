// Utilities
import { capitalize, computed, inject, provide, ref, watch } from 'vue'
import { colorToInt, colorToRGB, contrastRatio } from '../util'

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

interface VuetifyTheme extends BaseColors, OnColors {
  [key: string]: string
}

interface VuetifyThemeOption extends BaseColors, Partial<OnColors> {
  [key: string]: string | undefined
}

interface ThemeOptions {
  defaultTheme?: string
  themes?: Record<string, VuetifyThemeOption>
}

interface Theme {
  current: Ref<string>
  themes: Ref<Record<string, VuetifyTheme>>
  setTheme: (key: string, theme: VuetifyThemeOption) => void
}

export const VuetifyThemeSymbol: InjectionKey<Theme> = Symbol.for('vuetify-theme')

export const useTheme = (props: any = {}) => {
  const themeProvide = inject(VuetifyThemeSymbol)

  if (!themeProvide) throw new Error('Could not find vuetify theme provider')

  const current = computed(() => props.theme || themeProvide.current.value)
  const themeClass = computed(() => `theme--${current.value}`)

  const setCurrent = (name: string) => themeProvide.current.value = name

  provide(VuetifyThemeSymbol, {
    current,
    themes: themeProvide.themes,
    setTheme: themeProvide.setTheme,
  })

  return {
    themeClass,
    current,
    setCurrent,
    themes: themeProvide.themes,
    setTheme: themeProvide.setTheme,
  }
}

const defaultThemes: Record<string, VuetifyThemeOption> = {
  light: {
    background: '#ffffff',
    surface: '#aaaaaa',
    primary: '#ff0000',
    primaryVariant: '#ff00ff',
    secondary: '#0000ff',
    secondaryVariant: '#4444ff',
    success: '#00ff00',
    warning: '#ffff00',
    error: '#ff0000',
    info: '#3333ee',
  },
  dark: {
    background: '#222222',
    surface: '#ffffff',
    primary: '#ff00ff',
    primaryVariant: '#33ff33',
    secondary: '#555500',
    secondaryVariant: '#1155ff',
    success: '#00ff00',
    warning: '#ffff00',
    error: '#ff0000',
    info: '#0000ff',
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

export const createTheme = (options?: ThemeOptions): Theme => {
  const styleEl = ref<HTMLStyleElement | undefined>()
  const current = ref<string>(options?.defaultTheme ?? 'light')
  const themes = ref<Record<string, VuetifyThemeOption>>(options?.themes ?? defaultThemes)

  const genOnColor = (color: string) => {
    // naive solution
    const toHex = (v: number) => `#${v.toString(16).repeat(3)}`
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
    }, {} as Record<string, VuetifyTheme>)
  })

  const genCssVariables = (name?: string) => {
    const theme = computedThemes.value[name ?? current.value]

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
    current,
    themes: computedThemes,
    setTheme: (key: string, theme: VuetifyThemeOption) => themes.value[key] = theme,
  }
}
