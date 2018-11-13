/* eslint-disable */
import Vue from 'vue'
import App from './app.vue'
import Antd from 'ant-design-vue'
import router from './router'
import store from '@/store/login/store'

Vue.use(Antd)

Vue.config.productionTip = false
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
