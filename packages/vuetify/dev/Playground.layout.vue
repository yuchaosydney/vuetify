<template>
  <div>
    <v-layout :layout="layout" full-height>
      <v-navigation-drawer id="drawer1" :width="width" v-if="remove" v-model="show">nav</v-navigation-drawer>
      <v-navigation-drawer id="drawer2" right>nav</v-navigation-drawer>
      <v-app-bar id="toolbar" v-model="bar">toolbar</v-app-bar>
      <v-content>
        <button @click="bar = !bar">toggle bar</button>
        <button @click="show = !show">toggle nav</button>
        <button @click="remove = !remove">remove bar</button>
        <button @click="toggle">reverse</button>
        zxc
        <v-layout :layout="['bar', 'innerfoot', 'foo']" :style="{ margin: '100px' }">
          <v-navigation-drawer id="bar" v-model="inner" temporary>inner drawer</v-navigation-drawer>
          <v-app-bar id="foo">inner bar</v-app-bar>
          <v-footer id="innerfoot">inner footer</v-footer>
          <v-content>
            asdasdzxczxc
            <button @click="inner = !inner">inner</button>
          </v-content>
        </v-layout>
      </v-content>
    </v-layout>
    <!-- <v-layout full-height>
      <v-app-bar id="system-bar">system bar</v-app-bar>
      <v-navigation-drawer id="servers" :width="96">servers</v-navigation-drawer>
      <v-footer id="input">input</v-footer>
      <v-navigation-drawer id="info" right>info</v-navigation-drawer>
      <v-navigation-drawer id="channels">channels</v-navigation-drawer>
      <v-app-bar id="channel-header" :height="100">channel header</v-app-bar>
      <v-content>
        adasasd
      </v-content>
    </v-layout> -->
  </div>
</template>

<script>
  import { ref } from 'vue'
  import { useVuetify } from 'vuetify'

  export default {
    name: 'Playground',
    setup () {
      const vuetify = useVuetify()

      console.log(vuetify)

      const remove = ref(true)
      const show = ref(true)
      const inner = ref(true)
      const bar = ref(true)
      const appBarHeight = ref(24)
      const width = ref(300)
      // const layout = ref(['nav-drawer', 'system-bar', 'nav-drawer-right', 'footer:nav-drawer'])
      // const layout = ref(['footer', 'nav-drawer', 'system-bar', 'nav-drawer-right:footer'])
      // const layout = ref(['toolbar', 'drawer2', 'drawer1'])
      // const layout = ref(['drawer2', 'drawer1', 'toolbar'])
      const layout = ref(['drawer1', 'toolbar', 'drawer2'])
      const toggle = () => {
        console.log('foo')
        layout.value = layout.value.slice().reverse()
        console.log(layout.value)
      }

      setTimeout(() => {
        width.value = 200
      }, 2000)

      return {
        remove,
        show,
        inner,
        bar,
        appBarHeight,
        width,
        layout,
        toggle,
      }
    },
  }
</script>
