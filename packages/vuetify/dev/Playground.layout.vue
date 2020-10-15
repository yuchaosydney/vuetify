<template>
  <div>
    <v-layout>
      <v-app-bar :z-order="0" :height="appBarHeight">app bar</v-app-bar>
      <v-navigation-drawer :z-order="z" :width="96" v-if="servers">servers</v-navigation-drawer>
      <v-navigation-drawer :z-order="2" v-if="channels">channels</v-navigation-drawer>
      <v-app-bar :z-order="3" :height="96" v-if="channelHeader">channel header</v-app-bar>
      <v-navigation-drawer :z-order="4" right v-if="info">info</v-navigation-drawer>
      <v-footer :z-order="5" :height="100">input</v-footer>
      <v-content>
        <p>main content</p>
        <p>
          <input type="checkbox" :checked="servers" :onChange="() => servers = !servers"><label> servers</label>
          <br />
          <input type="checkbox" :checked="channels" :onChange="() => channels = !channels"><label> channels</label>
          <br />
          <input type="checkbox" :checked="channelHeader" :onChange="() => channelHeader = !channelHeader"><label> channelHeader</label>
          <br />
          <input type="checkbox" :checked="info" :onChange="() => info = !info"><label> info</label>
          <br />
          <label>app bar height</label>
          <input type="range" min="24" max="48" :value="String(appBarHeight)" :onInput="(e) => appBarHeight = parseInt(e.target.value, 10)">
          <br />
          <input type="number" :value="z" :onChange="e => z = parseInt(e.target.value, 10)" />
        </p>
      </v-content>
    </v-layout>
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

      const channelHeader = ref(true)
      const info = ref(true)
      const servers = ref(true)
      const channels = ref(true)
      const appBarHeight = ref(24)
      const z = ref(1)

      return {
        channelHeader,
        info,
        servers,
        channels,
        appBarHeight,
        z,
      }
    },
  }
</script>
