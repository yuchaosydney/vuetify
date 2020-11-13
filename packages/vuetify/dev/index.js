import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'
import { createApp, defineComponent, h } from 'vue'
import App from './App'

const app = createApp(App)
const vuetify = createVuetify({
  icon: {
    // component: defineComponent({
    //   name: 'Bar',
    //   props: {
    //     icon: String,
    //   },
    //   setup (props) {
    //     return () => h('div', {}, [props.icon])
    //   },
    // }),
    icons: {
      custom: defineComponent({
        name: 'Foo',
        props: {
          foo: String,
          icon: String,
        },
        setup (props) {
          console.log(props)
          return () => h('div', {}, ['x'])
        },
      }),
    },
  },
})

app.use(vuetify)

app.mount('#app')
