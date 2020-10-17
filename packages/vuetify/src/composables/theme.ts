import { colorToInt, contrastRatio } from '../util'
import { computed, inject, InjectionKey, onBeforeMount, provide, Ref, ref, watch } from 'vue'

interface VuetifyTheme {
  [key: string]: string
  background: string
  error: string
  info: string
  primary: string
  primaryVariant: string
  secondary: string
  secondaryVariant: string
  success: string
  surface: string
  warning: string
  text: string
  inverseText: string
}

interface VuetifyThemes {
  [key: string]: VuetifyTheme
  light: VuetifyTheme
  dark: VuetifyTheme
}

interface ThemeOptions {
  defaultTheme: string
  themes: VuetifyThemes
}

interface Theme {
  init: () => void
  current: Ref<keyof VuetifyThemes>
  themes: Ref<VuetifyThemes>
}

export const VuetifyThemeSymbol: InjectionKey<Theme> = Symbol.for('vuetify-theme')

export const useTheme = (props: any = {}) => {
  const themeProvide = inject(VuetifyThemeSymbol)

  if (!themeProvide) throw new Error('Could not find vuetify theme provider')

  onBeforeMount(() => themeProvide.init())

  const current = computed(() => props.theme || themeProvide.current.value)
  const colors = computed(() => themeProvide.themes.value[current.value])
  const themeClass = computed(() => `theme--${current.value}`)

  const setTheme = (name: keyof VuetifyThemes, theme: VuetifyTheme) => {
    themeProvide.themes.value[name] = theme
  }

  const setCurrent = (name: keyof VuetifyThemes) => themeProvide.current.value = name

  const checkContrast = (first: keyof VuetifyTheme, second: keyof VuetifyTheme) => {
    return contrastRatio(colorToInt(colors.value[first]), colorToInt(colors.value[second]))
  }

  const getTextClass = (color: keyof VuetifyTheme) => {
    const ratioNormal = checkContrast(color, 'text')
    const ratioInverse = checkContrast(color, 'inverseText')
    console.log(current.value, color, colors.value[color], colors.value.text, ratioNormal, colors.value.inverseText, ratioInverse)
    return ratioNormal > ratioInverse ? 'text' : 'inverseText'
  }

  provide(VuetifyThemeSymbol, {
    init: () => null,
    current,
    themes: themeProvide.themes,
  })

  return { themeClass, setTheme, setCurrent, checkContrast, getTextClass, current, themes: themeProvide.themes }
}

export const createTheme = (options?: ThemeOptions): Theme => {
  const initialized = ref(false)
  const styleEl = ref<HTMLStyleElement | undefined>()
  const current = ref<keyof VuetifyThemes>(options?.defaultTheme || 'light')
  const themes = ref<VuetifyThemes>(options?.themes || {
    light: {
      background: 'white',
      error: 'red',
      warning: 'yellow',
      info: 'blue',
      success: 'green',
      primary: 'red',
      primaryVariant: 'pink',
      secondary: 'blue',
      secondaryVariant: 'darkblue',
      surface: 'white',
      inverseText: '#ffffff',
      text: '#000000',
    },
    dark: {
      background: 'darkgrey',
      error: 'red',
      warning: 'yellow',
      info: 'blue',
      success: 'green',
      primary: 'purple',
      primaryVariant: 'pink',
      secondary: 'orange',
      secondaryVariant: 'darkblue',
      surface: 'white',
      inverseText: '#ffffff',
      text: '#000000',
    },
  })

  const generateCssVariables = (name?: string) => {
    const theme = themes.value[name || current.value]

    if (!theme) throw new Error('Could not find theme ' + name)

    const variables: Record<string, string> = {}
    for (const [key, value] of Object.entries(theme)) {
      variables[`--v-${key}`] = value
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

  const init = () => {
    if (initialized.value) return

    updateStyles()

    initialized.value = true
  }

  const updateStyles = () => {
    genStyleElement()

    const classes = []
    for (const themeName of Object.keys(themes.value)) {
      const variables = []
      for (const [key, value] of Object.entries(generateCssVariables(themeName))) {
        variables.push(`\t${key}: ${value};`)
      }
      classes.push(`.theme--${themeName} {\n${variables.join('\n')}\n}`)
    }

    styleEl.value!.innerHTML = classes.join('\n')
  }

  watch(themes, updateStyles, { deep: true })

  return {
    init,
    current,
    themes,
  }
}
