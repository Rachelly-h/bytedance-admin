import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    name: 'Login',
    path: '/login',
    component: () => import(/* webpackChunkName: 'login' */'@/views/login/index.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
