<template>
  <h1>About Page</h1>

  <h2>Movie Info</h2>

  <p>{{getMovie.original_title}}</p>
  <p>{{getMovie.vote_average}}</p>
  <p>{{getMovie.vote_count}}</p>
  <p>{{getMovie.release_date}}</p>
  <p>{{getMovie.runtime}}</p>
  <p>{{getMovie.original_language}}</p>
  <p v-for='genre in getMovie.genres' :key='genre'>{{genre.name}}</p>
  <p>{{getMovie.overview}}</p>

  <h2>Credits Info</h2>
  <h3>Cast</h3>
  <p v-for='castMember in getCredits.cast' :key='castMember'>
    cast original name: {{castMember.original_name}}
    <br />
    cast profile path: {{baseImageURL + castMember.profile_path}}
  </p>
  <h3>Crew</h3>
  <p v-for='crewMember in getCredits.crew' :key='crewMember'>
    {{crewMember}}
    crew original name: {{crewMember.original_name}}
    <br />
    crew profile path: {{baseImageURL + crewMember.profile_path}}
  </p>

  <h2>Reccommended Info</h2>
  <p v-for='movie in getReccommended.results' :key='movie'>
    poster path: {{baseImageURL + movie.poster_path}}
    </p>

</template>

<script>
import { useRoute } from 'vue-router'
import axios from 'axios'
import env from '@/env.js'
import { onMounted, ref } from 'vue'


export default {
  name: 'About',
  setup() {
    const route = useRoute()
    const getId = route.fullPath.slice(7)
    const getMovie = ref({})
    const baseImageURL = ref('https://image.tmdb.org/t/p/original/')
    const getCredits = ref({})
    const getReccommended = ref({})
    const getMovieDetailsURL = ref(`https://api.themoviedb.org/3/movie/${getId}?api_key=${env.apikey}&language=en-US`)
    const getCreditsURL = ref(`https://api.themoviedb.org/3/movie/${getId}/credits?api_key=${env.apikey}&language=en-US`)
    const getReccommendedURL = ref(`https://api.themoviedb.org/3/movie/${getId}/recommendations?api_key=${env.apikey}&language=en-US&page=1`)
    const getMoviesDetailsRequest = axios.get(getMovieDetailsURL.value)
    const getCreditsRequest = axios.get(getCreditsURL.value)
    const getReccomendedRequest = axios.get(getReccommendedURL.value)

    onMounted(() => {
      axios.all([getMoviesDetailsRequest, getCreditsRequest, getReccomendedRequest])
      .then(axios.spread((data1, data2, data3 ) => {
        console.log(data1.data)
        console.log(data2.data)
        console.log(data3.data)
        getMovie.value = data1.data
        getCredits.value = data2.data
        getReccommended.value = data3.data
      }))
      .catch(error => console.log(error))
    })

    return {
      getMovie,
      getCredits,
      getReccommended,
      baseImageURL
    }
  }
}
</script>

<style>
* {
  color: #fff;
}
</style>
