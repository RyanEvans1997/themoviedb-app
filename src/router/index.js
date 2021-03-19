import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MovieDetails from '../views/MovieDetails.vue'
import Error404 from '../views/Error404.vue'

console.log(window.location.href)

const routes = [
  {
    path: '/',
    name: 'HomeRedirect',
    component: Home,
    redirect: '/popular',
  },
  {
    path: '/:sortBy',
    name: 'Home',
    get component() {
      if(window.location.href == 'http://localhost:8080/' || window.location.href == 'http://localhost:8080/popular' || window.location.href == 'http://localhost:8080/top-rated' || window.location.href == 'http://localhost:8080/upcoming' || window.location.href == 'https://themoviedbapi.netlify.app/' || window.location.href == 'https://themoviedbapi.netlify.app/popular' || window.location.href == 'https://themoviedbapi.netlify.app/top-rated' || window.location.href == 'https://themoviedbapi.netlify.app/upcoming') 
      {
        return Home
      } else {
        return Error404
      }
    }
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
