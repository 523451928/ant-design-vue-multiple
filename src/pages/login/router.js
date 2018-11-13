import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import HelloWorld from '@/components/HelloWorld.vue'

Vue.use(Router)
let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login,
      meta: {title: '登录'}
    },
    {
      path: '/helloworld',
      component: HelloWorld,
      meta: {title: 'helloworld'}
    }
  ]
})

router.afterEach(route => {
  document.title = route.meta.title
})

export default router
