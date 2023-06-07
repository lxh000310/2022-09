import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from "@/views/Login";

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    meta:{authRequired: true},
    component: Home
  },
  {
    path:'/',
    name:'Login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken')
  if (to.name !== 'Login' && !token) next({ name: 'Login' })
  else next()
})

export default router
