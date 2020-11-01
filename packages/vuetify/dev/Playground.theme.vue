<template>
  <v-app>
    <foo/>
    <div>
      <div v-for="color in colors" :class="['box', color, `${color}--on`]" :key="color">{{ color }}</div>
    </div>
    <div>
      <div v-for="color in textColors" :class="['box', `${color}--text`]" :key="`${color}--text`">{{ color }}</div>
    </div>
    <v-theme-provider theme="dark">
      <foo/>
      <div>
        <div v-for="color in colors" :class="['box', color, `${color}--on`]" :key="color">{{ color }}</div>
      </div>
      <div>
        <div v-for="color in textColors" :class="['box', `${color}--text`]" :key="`${color}--text`">{{ color }}</div>
      </div>
      <v-theme-provider theme="contrast">
        <div>
          <div v-for="color in colors" :class="['box', color, `${color}--on`]" :key="color">{{ color }}</div>
        </div>
        <div>
          <div v-for="color in textColors" :class="['box', `${color}--text`]" :key="`${color}--text`">{{ color }}</div>
        </div>
        <v-theme-provider theme="light">
          <div>
            <div v-for="color in colors" :class="['box', color, `${color}--on`]" :key="color">{{ color }}</div>
          </div>
          <div>
            <div v-for="color in textColors" :class="['box', `${color}--text`]" :key="`${color}--text`">{{ color }}</div>
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
        textColors: ['text', 'primary', 'primaryVariant', 'second', 'secondaryVariant', 'success', 'warning', 'error', 'info'],
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
