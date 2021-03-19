import Client from './Clients/AxiosClient'
import env from '@/env.js'
import axios from 'axios'

export default {
    getPopularMovies() {
        return Client.get(`https://api.themoviedb.org/3/movie/popular?api_key=f41066b07d9167a03c4f7c173befdf6f&language=en-US&page=1`)
    },
    getTopRatedMovies() {
        return Client.get(`movie/top_rated?api_key=${env.apikey}&language=en-US&page=1`)
    },
    getUpcomingMovies() {
        return Client.get(`movie/upcoming?api_key=${env.apikey}&language=en-US&page=1`)
    },
    getCatgoriesList() {
        return Client.get(`genre/movie/list?api_key=${env.apikey}&language=en-US&page=1`)
    },
    getMovieDetails() {

    }
}