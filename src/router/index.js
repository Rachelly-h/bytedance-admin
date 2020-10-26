import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    name: 'login',
    path: '/login',
    // 目录下的index.vue可以省略
    component: () => import(/* webpackChunkName: 'login' */'@/views/login/')
  },
  {
    path: '/',
    // 命名路由layout有一个默认子路由，这个名字没有意义
    // name: 'layout',
    component: () => import(/* webpackChunkName: 'layout' */'@/views/layout/'),
    children: [
      {
        name: 'home',
        path: '', // 空表示默认子路由
        component: () => import(/* webpackChunkName: 'home' */'@/views/home/')
      },
      {
        name: 'article',
        path: '/article',
        // 目录下的index.vue可以省略
        component: () => import(/* webpackChunkName: 'login' */'@/views/article/')
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
