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
    <img :src="baseImageURL + getMovie.poster_path" alt="" style='height: 500px; width: 300px; float: left; margin-right: 20px'>
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

  <div style='margin-bottom: 20px'>
    <h3 style='float: left; display: inline-block; margin-left: 15px'>Cast</h3>
    <h3 style='margin-left: -600px; display: inline-block'>Crew</h3>
  </div>


  <div v-for='castMember in getMovieCast' :key='castMember' class='castMembers'>
    <p style='position: absolute; bottom: 28px; right: auto;'>{{castMember.original_name}}</p>
    <p style='position: absolute; bottom: 5px; right: auto;'>{{castMember.character}}</p>
    <br />
    <img :src="baseImageURL + castMember.profile_path" alt="" style='width: 150px; height: 200px;'>
  </div>

 
  <div v-for='crewMember in getMovieCrew' :key='crewMember' class='crewMembers'>
    <p style='position: absolute; bottom: 8px; right: auto;'>{{crewMember.original_name}}</p>
    <br />
    <img :src="baseImageURL + crewMember.profile_path" alt="" style='width: 150px; height: 200px;'>
  </div>

  <br>

  <h2 style='margin-top: 250px; text-align: left; margin-left: 15px;'>Reccommended</h2>
  <div v-for='movie in getPartialReccomended' :key='movie' class='partialReccomended'>
    <img :src="baseImageURL + movie.poster_path" alt="" style='width: 200px; height: 300px;'>
  </div>
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
    const getMovieCast = ref({})
    const getMovieCastCharacter = ref({})
    const getMovieCrew = ref({})
    const getPartialReccomended = ref({})

    onMounted(() => {
      axios.all([getMoviesDetailsRequest, getCreditsRequest, getReccomendedRequest])
      .then(axios.spread((data1, data2, data3 ) => {
        // console.log(data1.data)
        // console.log(data2.data)
        // console.log(data3.data)
        getMovie.value = data1.data
        getCredits.value = data2.data
        getReccommended.value = data3.data

        getMovieCast.value = getCredits.value.cast.slice(0, 4)
        getMovieCastCharacter.value = getCredits.value.cast.character
        getMovieCrew.value = getCredits.value.crew.slice(0, 3)
        getPartialReccomended.value = getReccommended.value.results.slice(0, 6)

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
      getMovieRunning,
      getMovieCast,
      getMovieCrew,
      getPartialReccomended,
      getMovieCastCharacter
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
  margin-left: 10%;
  width: 90%;
}

.castMembers {
  display: flex; 
  float: left;
  width: 170px;
  justify-content: space-around;
  position: relative;
}

.crewMembers {
  display: flex; 
  float: left;
  width: 170px;
  justify-content: space-around;
  position: relative;
}

.partialReccomended {
  display: flex; 
  float: left;
  width: 230px;
  justify-content: space-around;
  position: relative;
}

.firstMoviePosterBG {
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
}

.movieInfo {
  display: inline-block;
  margin-top: 25%;
  margin-bottom: 5%;
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
