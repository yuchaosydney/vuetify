import '@mdi/font/css/materialdesignicons.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

import viteSSR from 'vite-ssr/vue'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import vuetify from './vuetify'
import Home from './Home.vue'
import About from './About.vue'
// import { routes } from './router'

library.add(fas)

const routes = [
  {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('./About.vue')
    }
]

export default viteSSR(App, { routes }, ({ app }) => {
  const head = createHead()

  app.use(head)
  app.use(vuetify)
  app.component('FontAwesomeIcon', FontAwesomeIcon)

  return { head }
})
