<template>
  <div>
    <v-layout :layout="layout">
      <v-app-bar id="toolbar">toolbar</v-app-bar>
      <v-navigation-drawer id="drawer1" right>drawer1</v-navigation-drawer>
      <v-navigation-drawer id="drawer2" right>drawer2</v-navigation-drawer>
      <v-content>
        <p>main content</p>
      </v-content>
    </v-layout>
  </div>
  <!-- <v-layout :layout="['system-bar', 'servers', 'channels', 'channel-header', 'info', 'input']">
    <v-app-bar id="system-bar">system bar</v-app-bar>
    <v-navigation-drawer id="servers" :width="96">servers</v-navigation-drawer>
    <v-navigation-drawer id="channels">channels</v-navigation-drawer>
    <v-app-bar id="channel-header" :height="100">channel header</v-app-bar>
    <v-navigation-drawer id="info" right>info</v-navigation-drawer>
    <v-footer id="input">input</v-footer>
    <v-content>
      <p>main content</p>
    </v-content>
  </v-layout> -->
</template>

<script>
  import { ref } from 'vue'
  import { useVuetify } from 'vuetify'

  export default {
    name: 'Playground',
    setup () {
      const vuetify = useVuetify()

      console.log(vuetify)

      const channelHeader = ref(true)
      const info = ref(true)
      const servers = ref(true)
      const channels = ref(true)
      const appBarHeight = ref(24)
      const z = ref(1)
      // const layout = ref(['nav-drawer', 'system-bar', 'nav-drawer-right', 'footer:nav-drawer'])
      // const layout = ref(['footer', 'nav-drawer', 'system-bar', 'nav-drawer-right:footer'])
      // const layout = ref(['toolbar', 'drawer2', 'drawer1'])
      // const layout = ref(['drawer2', 'drawer1', 'toolbar'])
      const layout = ref(['drawer2', 'toolbar', 'drawer1'])
      const toggle = () => {
        console.log('foo')
        layout.value = layout.value.slice().reverse()
        console.log(layout.value)
      }

      return {
        channelHeader,
        info,
        servers,
        channels,
        appBarHeight,
        z,
        layout,
        toggle,
      }
    },
  }
</script>
