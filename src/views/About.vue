<template>
<div class='firstMoviePosterBG' :style="
  {
    backgroundImage: 'url(' + baseImageURL + getMovie.poster_path + ')'
  }
  ">   
</div>
<div class='about'>

 <div v-if='hamburgerOpen' class='hamburger'>
    <i @click='toggleHamburger' class="fas fa-bars fa-2x" style='float: right'></i>
  </div>
<div v-else class='hamburger'>
      <span class='dot'></span>
      <i @click='toggleHamburger' class="fas fa-times fa-2x" style='float: right'></i>
      <ul style='text-align: right; float:right'>
        <li>
          Popular
        </li>
        <li>
          Top Rated
        </li>
        <li>
          Upcoming
        </li>
      </ul>
  </div>

  <div class='movieInfo'>
    <img :src="baseImageURL + getMovie.poster_path" alt="" style='height: 300px; width: 300px; float: left; margin-right: 20px'>
    <p style='font-weight: bold; font-size: 38px;'>{{getMovie.original_title}}</p>
    <i style='float: left; color: orange;' class="fas fa-star fa-3x"></i>
    <p>{{getMovie.vote_average}}</p>
    <p>{{getMovie.vote_count}} votes</p>
    <br>
    <p>{{getMovieYear}}</p>
    <p>{{getMovieRunning}}</p>
    <p>{{getMovie.original_language}}</p>
    <p v-for='genre in getMovie.genres' :key='genre' style='display: inline; float: left'>
      {{genre.name}}, &nbsp;
    </p>
    <br>
        <br>
    <p>{{getMovie.overview}}</p>
  </div>

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
  </div>
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
    let hamburgerOpen = ref(true)
    const getReccommended = ref({})
    const getMovieDetailsURL = ref(`https://api.themoviedb.org/3/movie/${getId}?api_key=${env.apikey}&language=en-US`)
    const getCreditsURL = ref(`https://api.themoviedb.org/3/movie/${getId}/credits?api_key=${env.apikey}&language=en-US`)
    const getReccommendedURL = ref(`https://api.themoviedb.org/3/movie/${getId}/recommendations?api_key=${env.apikey}&language=en-US&page=1`)
    const getMoviesDetailsRequest = axios.get(getMovieDetailsURL.value)
    const getCreditsRequest = axios.get(getCreditsURL.value)
    const getReccomendedRequest = axios.get(getReccommendedURL.value)
    const getMovieYear = ref('')
    const getMovieRunning = ref(0)

    onMounted(() => {
      axios.all([getMoviesDetailsRequest, getCreditsRequest, getReccomendedRequest])
      .then(axios.spread((data1, data2, data3 ) => {
        // console.log(data1.data)
        // console.log(data2.data)
        // console.log(data3.data)
        getMovie.value = data1.data
        getCredits.value = data2.data
        getReccommended.value = data3.data

        getMovieYear.value = getMovie.value.release_date.slice(0,4)
        getMovieRunning.value = `${Math.floor(getMovie.value.runtime / 60)}h ${getMovie.value.runtime % 60} m`
      }))
      .catch(error => console.log(error))
    })

    function toggleHamburger() {
      hamburgerOpen.value = !hamburgerOpen.value
    }


    return {
      getMovie,
      getCredits,
      getReccommended,
      baseImageURL,
      toggleHamburger,
      hamburgerOpen,
      getMovieYear,
      getMovieRunning
    }
  }
}
</script>

<style>
* {
  color: #fff;
}

p {
  padding: auto;
  text-align: left;
}

.about {
  margin-left: 20%
}

.firstMoviePosterBG {
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
}

.movieInfo {
  display: inline-block;
  margin-top: 25%;
}

.hamburger {
  color: #fff;
  position: absolute;
  right: 2%;
  top: 5%;
  width: 100px;
  
  ul {
    list-style-type: none;
  }

  li {
    padding: 10px;
  }
}

.hamburger:hover {
  cursor: pointer;
}
</style>
