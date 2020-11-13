<template>
  <v-app>
    <foo/>
    <div>
      <div v-for="color in colors" :class="['box', `bg-${color}`, `on-${color}`]" :key="color">{{ color }}</div>
    </div>
    <div>
      <div v-for="color in textColors" :class="['box', `text-${color}`, 'border', `border-${color}`]" :key="color">{{ color }}</div>
    </div>
    <v-theme-provider class="padding">
      <foo/>
      <div>
        <div v-for="color in colors" :class="['box', `bg-${color}`, `on-${color}`]" :key="color">{{ color }}</div>
      </div>
      <div>
        <div v-for="color in textColors" :class="['box', `text-${color}`, 'border', `border-${color}`]" :key="color">{{ color }}</div>
      </div>
      <v-theme-provider theme="contrast" class="padding">
        <div>
          <div v-for="color in colors" :class="['box', `bg-${color}`, `on-${color}`]" :key="color">{{ color }}</div>
        </div>
        <div>
          <div v-for="color in textColors" :class="['box', `text-${color}`, 'border', `border-${color}`]" :key="color">{{ color }}</div>
        </div>
        <v-theme-provider class="padding">
          <div>
            <div v-for="color in colors" :class="['box', `bg-${color}`, `on-${color}`]" :key="color">{{ color }}</div>
          </div>
          <div>
            <div v-for="color in textColors" :class="['box', `text-${color}`, 'border', `border-${color}`]" :key="color">{{ color }}</div>
          </div>
        </v-theme-provider>
      </v-theme-provider>
    </v-theme-provider>
  </v-app>
</template>

<script>
  import { defineComponent, h, onBeforeMount } from 'vue'
  import { useTheme } from 'vuetify'

  const Foo = defineComponent({
    setup (props) {
      const theme = useTheme()
      onBeforeMount(() => {
        theme.setTheme('contrast', {
          background: '#000000',
          surface: '#222222',
          primary: '#eeeeee',
          secondary: '#ffff00',
          success: '#00ff00',
          warning: '#ffff00',
          error: '#ff0000',
          info: '#0000ff',
          'primary-lighten-1': '#ff00ff',
        })
      })
      return () => h('div', [h('div', { onClick: theme.next }, 'next'), h('input', { value: theme.current.value, onInput: e => theme.current.value = e.target.value })])
    },
  })

  export default {
    name: 'Playground',
    components: { Foo },
    setup () {
      return {
        colors: ['surface', 'primary-darken-1', 'primary', 'primary-lighten-1', 'primary-lighten-2', 'secondary-lighten-1', 'secondary', 'secondary-darken-1', 'success', 'warning', 'error', 'info'],
        textColors: ['text', 'primary-darken-1', 'primary', 'primary-lighten-1', 'primary-lighten-2', 'secondary-lighten-1', 'secondary', 'secondary-darken-1', 'success', 'warning', 'error', 'info'],
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

  .border {
    border: 4px solid;
  }

  .padding {
    padding-left: 1rem
  }
</style>
