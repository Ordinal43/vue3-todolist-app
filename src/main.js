import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark',
  },
})

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
