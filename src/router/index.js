import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MovieDetails from '../views/MovieDetails.vue'

const routes = [
  {
    path: '/',
    name: 'HomeRedirect',
    component: Home,
    redirect: '/popular'

  },
  {
    path: '/:sortBy',
    name: 'Home',
    component: Home
  },
  {
    path: '/movie-details/:id',
    name: 'MovieDetails',
    props: true,
    component: MovieDetails
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
