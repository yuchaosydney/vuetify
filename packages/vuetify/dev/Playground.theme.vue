<template>
  <div>
    <v-theme-provider>
      <button @click="change">modify light theme</button>
      <button @click="def">cycle defined themes</button>
      <div>
        <div v-for="color in colors" :class="['box', color]" :key="color">{{ color }}</div>
      </div>
      <div>
        <div v-for="color in textColors" :class="['box', `${color}--text`]" :key="`${color}--text`">{{ color }}</div>
      </div>
      <v-theme-provider theme="dark">
        <div>
          <div v-for="color in colors" :class="['box', color]" :key="color">{{ color }}</div>
        </div>
        <div>
          <div v-for="color in textColors" :class="['box', `${color}--text`]" :key="`${color}--text`">{{ color }}</div>
        </div>
        <v-theme-provider theme="contrast">
          <div>
            <div v-for="color in colors" :class="['box', color]" :key="color">{{ color }}</div>
          </div>
          <div>
            <div v-for="color in textColors" :class="['box', `${color}--text`]" :key="`${color}--text`">{{ color }}</div>
          </div>
          <v-theme-provider theme="light">
            <div>
              <div v-for="color in colors" :class="['box', color]" :key="color">{{ color }}</div>
            </div>
            <div>
              <div v-for="color in textColors" :class="['box', `${color}--text`]" :key="`${color}--text`">{{ color }}</div>
            </div>
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

      return {
        colors: ['surface', 'primary', 'primaryVariant', 'secondary', 'secondaryVariant', 'success', 'warning', 'error', 'info'],
        textColors: ['text', 'primary', 'primaryVariant', 'second', 'secondaryVariant', 'success', 'warning', 'error', 'info'],
        theme,
        def: () => {
          const keys = Object.keys(theme.themes.value)
          const index = keys.indexOf(theme.current.value)
          const newIndex = (index + 1 >= keys.length) ? 0 : index + 1
          theme.setCurrent(keys[newIndex])
        },
        change: () => theme.setTheme('light', {
          ...theme.themes.value.light,
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

<style>
  .box {
    width: 150px;
    height: 150px;
    display: inline-block;
  }
</style>
