import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MovieDetails from '../views/MovieDetails.vue'
import Error404 from '../views/Error404.vue'
let dynamicRoute;

console.log(window.location.href)

const allRoutes = ['http://localhost:8080/', 'http://localhost:8080/popular', 'http://localhost:8080/top-rated', 'http://localhost:8080/upcoming', 'https://themoviedbapi.netlify.app/', 'https://themoviedbapi.netlify.app/popular', 'https://themoviedbapi.netlify.app/top-rated', 'https://themoviedbapi.netlify.app/upcoming']

if(allRoutes.includes(window.location.href)) {
  dynamicRoute = Home;
} else {
  dynamicRoute = Error404;
}

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
    component: dynamicRoute
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
