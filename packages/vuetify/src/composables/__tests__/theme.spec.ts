import { createTheme } from '../'

describe('createTheme', () => {
  it('should generate on-* colors', async () => {
    const theme = createTheme()

    const colors = [
      'onBackground',
      'onSurface',
      'onPrimary',
      'onPrimaryVariant',
      'onSecondary',
      'onSecondaryVariant',
      'onSuccess',
      'onWarning',
      'onError',
      'onInfo',
    ]

    for (const color of colors) {
      expect(theme.themes.value.light).toHaveProperty(color)
    }
  })

  it('should update existing theme', async () => {
    const theme = createTheme()

    expect(theme.themes.value.light.background).not.toEqual('#FF0000')

    theme.setTheme('light', {
      ...theme.themes.value.light,
      background: '#FF0000',
    })

    expect(theme.themes.value.light.background).toEqual('#FF0000')
  })
})
