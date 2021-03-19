<template>
<div class='firstMoviePosterBG' :style="
  {
    backgroundImage: 'url(' + baseImageURL + getMovie.poster_path + ')'
  }
  ">   
</div>
<div class='container'>
  <div v-if='hamburgerOpen' class='hamburger'>
    <i @click='toggleHamburger' class="fas fa-bars fa-2x" style='position: absolute; bottom: 55%;'></i>
  </div>
<div v-else class='hamburger' style='background-color: #274D74;'>
      <i @click='toggleHamburger' class="fas fa-times fa-2x" style='position: absolute; bottom: 55%;'></i>
      <ul style='text-align: right; position: absolute; bottom: 18%; left: 22%; color: #fff;'>
        <li>
          <router-link class='navBarLinks' :to="{name: 'Home', params: {sortBy: 'popular'.replace(' ', '-')}}">
            Popular
          </router-link>
        </li>
        <li>
         <router-link class='navBarLinks' :to="{name: 'Home', params: {sortBy: 'top rated'.replace(' ', '-')}}">
            Top Rated
          </router-link>
        </li>
        <li>
          <router-link class='navBarLinks' :to="{name: 'Home', params: {sortBy: 'upcoming'.replace(' ', '-')}}">
            Upcoming
          </router-link>
        </li>
      </ul>
  </div>

  <div class='movieInfo'>
    <img :src="baseImageURL + getMovie.poster_path" alt="" style='height: 500px; width: 300px; float: left; margin-right: 20px'>
    <p style='font-weight: bold; font-size: 38px;'>{{getMovie.original_title}}</p>
    <i style='float: left; color: orange; margin-right: 10px' class="fas fa-star fa-3x"></i>
    <p style='color: #f3b814; font-size: 28px'>{{getMovie.vote_average}}</p>
    <p style='color: #8a6a11'>{{getMovie.vote_count}} votes</p>
    <br>
    <ul class='movieDetails'>
      <li class='listSpacing' >
        {{getMovieYear}}
      </li>
      <li class='listSpacing' >
        {{getMovieRunning}}
      </li>
      <li class='listSpacing'>
        {{getMovie.original_language}}
      </li>
      <div style='display: inline; margin-left: 15px'>
        <div style='display: inline;' v-for='(genre, index) in getMovie.genres' :key='genre'>
        <li v-if='index != Object.keys(getMovie.genres).length - 1' style='padding: 0 0 0 0'>
          {{genre.name}},
        </li>
        <li v-else style='padding: 0'>
           {{genre.name}}
        </li>
      </div>
      </div>

      </ul>

    <p style='margin-left: 330px; margin-top: 30px; '>{{getMovie.overview}}</p>
  </div>

  <div class='castCrewLabels'>
    <h1>Cast</h1>
    <h1>Crew</h1>
  </div>

  <div class='castCrewMembers'>

    <div v-for='castMember in getMovieCast' :key='castMember' class='castMember'>

    <div class='pContainer'>
    <p>{{castMember.original_name}}</p>
    <p style='font-weight: 300'>{{castMember.character}}</p>
    </div>

    <img v-if='baseImageURL + castMember.profile_path == "https://image.tmdb.org/t/p/original/null"' src="https://inspireddentalcare.co.uk/wp-content/uploads/2016/05/Facebook-default-no-profile-pic.jpg" alt="" style='width: 200px; height: 300px;' class='ImageFilter'>
    <img v-else :src="baseImageURL + castMember.profile_path" alt="" class='ImageFilter'>
    </div>

    <div v-for='crewMember in getMovieCrew' :key='crewMember' class='crewMember'>
    <div class='pContainer'>
      <p>{{crewMember.original_name}}</p>
    </div>

    <img v-if='baseImageURL + crewMember.profile_path == "https://image.tmdb.org/t/p/original/null"' src="https://inspireddentalcare.co.uk/wp-content/uploads/2016/05/Facebook-default-no-profile-pic.jpg" alt="" class='ImageFilter'>
    <img v-else :src="baseImageURL + crewMember.profile_path" alt="" class='ImageFilter'>
    </div>

  </div>

  <div class='castCrewLabels'>
    <h1 style='margin-top: 50px;'>Reccommended Movies</h1>
  </div>

    <div class='castCrewMembers2' >

    <div v-for='(movie, index) in getPartialReccomended' :key='movie' class='castMember' @mouseenter.self='toggleHover(index)' @mouseleave.self='toggleHover(index)' >

      <div v-if='hover && currentlyShowing === index'> 
        <div class='pContainer2'>
        <p>{{movie.release_date.slice(0,4)}} </p>
        <p>{{movie.original_title}} </p>
        <button class='goToMovieBtn'>
        <router-link :to="{name: 'MovieDetails', params: {id: movie.id, fullMovie: movie}}" style='color: #f3b814; text-decoration: none'>
              Go To Movie
          </router-link>
          </button>
    </div>

      </div>


    <img :src="baseImageURL + movie.poster_path" alt="" style='display: inline-block; width: 200px; height: 300px;' :class="{ 'imgHover': hover && currentlyShowing === index}">
    </div>

  </div>
  </div>

</template>

<script>
import { useRoute } from 'vue-router'
import axios from 'axios'
import env from '@/env.js'
import { onMounted, ref } from 'vue'


export default {
  name: 'MovieDetails',
  setup() {
    const route = useRoute()
    const getId = route.fullPath.slice(15)
    const getMovie = ref({})
    const baseImageURL = ref('https://image.tmdb.org/t/p/original/')
    const getCredits = ref({})
    const hamburgerOpen = ref(true)
    const getReccommended = ref({})
    const getMovieDetailsURL = ref(`https://api.themoviedb.org/3/movie/${getId}?api_key=${env.apikey}&language=en-US`)
    const getCreditsURL = ref(`https://api.themoviedb.org/3/movie/${getId}/credits?api_key=${env.apikey}&language=en-US`)
    const getReccommendedURL = ref(`https://api.themoviedb.org/3/movie/${getId}/recommendations?api_key=${env.apikey}&language=en-US&page=1`)
    const getMoviesDetailsRequest = axios.get(getMovieDetailsURL.value)
    const getCreditsRequest = axios.get(getCreditsURL.value)
    const getReccomendedRequest = axios.get(getReccommendedURL.value)
    const getMovieYear = ref('')
    const getMovieRunning = ref(0)
    const hover = ref(false)
    const currentlyShowing = ref(null)
    const getMovieCast = ref({})
    const getMovieCastCharacter = ref({})
    const getMovieCrew = ref({})
    const getPartialReccomended = ref({})

    function toggleHover (index) {
        hover.value = !hover.value
        currentlyShowing.value = index
    }

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
        getMovieRunning.value = `${Math.floor(getMovie.value.runtime / 60)}h ${getMovie.value.runtime % 60} mins`

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
      hover,
      hamburgerOpen,
      getMovieYear,
      getMovieRunning,
      getMovieCast,
      getMovieCrew,
      getPartialReccomended,
      getMovieCastCharacter,
      toggleHover,
      currentlyShowing,
    }
  }
}
</script>

<style lang='scss'>
* {
  box-sizing: border-box;
}

html,body {
  max-width: 100%;
  overflow-x: hidden;
}

p {
  padding: auto;
  text-align: left;
  font-size: 15px;
  color: #fff;
}

h1 {
  color: #fff;
  font-weight: 300;
}

.navBarLinks {
  text-decoration: none;
  color: #fff;
}

.movieDetails {
  margin-left: 300px;
  width: 800px;
  

  li {
    padding: 0px 10px;
    display: inline;
    color: #fff;
  }
}

.about {
  margin-left: 16.66%;
  width: 66%;
  max-width: 1264px;
}

.castCrewMembers {
  max-width: 1264px;
  display: flex;
  white-space: nowrap;
  flex-shrink: 0;
  overflow-x: scroll;
  justify-content:  space-between;
}

.castCrewMembers2 {
  max-width: 1264px;
  display: flex;
  white-space: nowrap;
  flex-shrink: 0;
  overflow-x: scroll;
  justify-content:  space-between;
}

.ImageFilter {
  filter: contrast(70%) brightness(60%);
  display: inline-block;
  width: 200px;
  height: 300px;
}

.castMember {
  position: relative;
  width: 200px;
  color: white;
  margin-right: 30px;
}

.castCrewLabels {
  margin-bottom: 20px;
  width: 770px; 
  display: flex; 
  justify-content: space-between;
}

.pContainer {
    display: flex;
    position: absolute;
    align-items: center;
    flex-direction: column;
    justify-content: space-around;
    bottom: 10px;
    left: 10px;
    width: 180px;
    height: 50px;
    z-index: 1; 
}

.crewMember {
  position: relative;
  text-align: center;
  color: white;
  margin-right: 30px;
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

.listSpacing {
  padding: 0px 0px;
  border-right: 0.1px solid #a3a2a2;
}

.movieInfo {
  text-align: left;
  display: inline;
  width: 100%;
  float: left;
  margin-top: 25%;
  margin-bottom: 5%;
}

.hamburger:hover {
  cursor: pointer;
}
</style>
