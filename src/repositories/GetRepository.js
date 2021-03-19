import Client from './Clients/AxiosClient'

export default {
    getPopularMovies() {
        return Client.get(`https://api.themoviedb.org/3/movie/popular?api_key=f41066b07d9167a03c4f7c173befdf6f&language=en-US&page=1`)
    },
    getTopRatedMovies() {
        return Client.get(`movie/top_rated?api_key=${process.env.VUE_APP_APIKEY}&language=en-US&page=1`)
    },
    getUpcomingMovies() {
        return Client.get(`movie/upcoming?api_key=${process.env.VUE_APP_APIKEY}&language=en-US&page=1`)
    },
    getCatgoriesList() {
        return Client.get(`genre/movie/list?api_key=${process.env.VUE_APP_APIKEY}&language=en-US&page=1`)
    },
    getMovieDetails() {

    }
}