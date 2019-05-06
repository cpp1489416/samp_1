import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon

import ajax from '@/utils/ajax'

import './mock'

import 'vuetify/dist/vuetify.css'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

// import '@/mock'

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

Vue.prototype.ajax = ajax

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
