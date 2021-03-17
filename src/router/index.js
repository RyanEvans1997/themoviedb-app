import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

const routes = [
  {
    path: '/',
    name: 'HomeRedirect',
    component: Home,
    redirect: '/Popular'

  },
  {
    path: '/:sortBy',
    name: 'Home',
    component: Home
  },
  {
    path: '/about/:id',
    name: 'About',
    props: true,
    component: About
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
