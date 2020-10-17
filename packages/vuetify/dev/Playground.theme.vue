<template>
  <div>
    <v-theme-provider>
      <button @click="change">modify light theme</button>
      <button @click="def">cycle defined themes</button>
      <div>regular text</div>
      <div class="primary">primary</div>
      <div class="secondary">secondary</div>
      <div class="primaryVariant">primaryVariant</div>
      <v-icon />
      <v-theme-provider theme="dark">
        <div>regular text</div>
        <div class="primary">primary</div>
        <div class="secondary">secondary</div>
        <div class="primaryVariant">primaryVariant</div>
        <v-icon />
        <v-theme-provider theme="contrast">
          <div>regular text</div>
          <div class="primary">primary</div>
          <div class="secondary">secondary</div>
          <div class="primaryVariant">primaryVariant</div>
          <v-icon />
          <v-theme-provider theme="light">
            <div>regular text</div>
            <div class="primary">primary</div>
            <div class="secondary">secondary</div>
            <div class="primaryVariant">primaryVariant</div>
            <v-icon />
          </v-theme-provider>
        </v-theme-provider>
      </v-theme-provider>
    </v-theme-provider>
  </div>
</template>

<script>
  import { useTheme } from 'vuetify'

  export default {
    name: 'Playground',
    setup () {
      const theme = useTheme()
      console.log(theme)

      return {
        theme,
        def: () => {
          const keys = Object.keys(theme.themes.value)
          const index = keys.indexOf(theme.current.value)
          const newIndex = (index + 1 >= keys.length) ? 0 : index + 1
          theme.setCurrent(keys[newIndex])
        },
        change: () => theme.setTheme('light', {
          ...theme.themes.light,
          background: '#d3d3d3',
          primary: '#a52a2a',
          secondary: '#008000',
          text: '#ffffff',
          inverseText: '#000000',
        }),
      }
    },
  }
</script>
