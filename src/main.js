import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'

import './assets/css/main.css'

import App from './App.vue'
import router from './router'
import { comingSoon } from './directives/comingSoon'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('VueApexCharts', VueApexCharts)
app.directive('coming-soon', comingSoon)

app.mount('#app')
