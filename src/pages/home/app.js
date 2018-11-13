/* eslint-disable */
import Vue from 'vue'
import Antd from 'ant-design-vue'
import App from './app.vue'
import 'ant-design-vue/dist/antd.css'

Vue.use(Antd)

Vue.config.productionTip = false
new Vue({
  el: '#app',
  render: h => h(App)
})
