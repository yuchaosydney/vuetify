<template>
  <v-app>
    <foo/>
    <div>
      <div v-for="color in colors" :class="['box', `bg-${color}`, `on-${color}`]" :key="color">{{ color }}</div>
    </div>
    <div>
      <div v-for="color in textColors" :class="['box', `text-${color}`, 'border', `border-${color}`]" :key="color">{{ color }}</div>
    </div>
    <v-theme-provider theme="dark" class="padding">
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
        <v-theme-provider theme="light" class="padding">
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
  import { defineComponent, h } from 'vue'
  import { useTheme } from 'vuetify'

  const Foo = defineComponent({
    setup (props) {
      const theme = useTheme()
      return () => h('div', { onClick: theme.next }, ['next'])
    }
  })

  export default {
    name: 'Playground',
    components: { Foo },
    setup () {
      return {
        colors: ['surface', 'primary', 'primaryVariant', 'secondary', 'secondaryVariant', 'success', 'warning', 'error', 'info'],
        textColors: ['text', 'primary', 'primaryVariant', 'secondary', 'secondaryVariant', 'success', 'warning', 'error', 'info'],
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
