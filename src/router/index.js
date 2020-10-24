import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    name: 'login',
    path: '/login',
    component: () => import(/* webpackChunkName: 'login' */'@/views/login/index.vue')
  },
  {
    path: '/',
    // 命名路由layout有一个默认子路由，这个名字没有意义
    // name: 'layout',
    component: () => import(/* webpackChunkName: 'layout' */'@/views/layout/index.vue'),
    children: [
      {
        name: 'home',
        path: '', // 空表示默认子路由
        component: () => import(/* webpackChunkName: 'home' */'@/views/home/index.vue')
      }
    ]
  }

]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    const user = JSON.parse(window.localStorage.getItem('user'))
    if (user) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
