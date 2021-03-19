<template>
<div class='firstMoviePosterBG' :style="
  {
    backgroundImage: 'url(' + baseImageURL + getMovie.poster_path + ')',
    height: '300px'
  }
  ">   
</div>
<div class='container'>
  <div v-if='hamburgerOpen' class='hamburger'>
    <i @click='toggleHamburger' class="fas fa-bars fa-2x toggleHamburgerSpacing"></i>
  </div>
<div v-else class='hamburger' style='background-color: #274D74;'>
      <i @click='toggleHamburger' class="fas fa-times fa-2x toggleHamburgerSpacing"></i>
      <ul>
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

  <MovieInfo :baseImageURL="baseImageURL" :getMovie='getMovie' :getMovieYear='getMovieYear' :getMovieRunning='getMovieRunning' />

  <div class='castCrewLabels'>

  </div>

  <div class='castCrewMembers' style='position: relative'>
    <h1 id='castLabel'>Cast</h1>
    <h1 id='crewLabel'>Crew</h1>

    <div v-for='castMember in getMovieCast' :key='castMember' class='castMember'>

    <div class='pContainer'>
    <p>{{castMember.original_name}}</p>
    <p id='characterName'>{{castMember.character}}</p>
    </div>

    <img v-if='baseImageURL + castMember.profile_path == "https://image.tmdb.org/t/p/original/null" || baseImageURL + castMember.profile_path == "https://image.tmdb.org/t/p/original/undefined"' src="https://inspireddentalcare.co.uk/wp-content/uploads/2016/05/Facebook-default-no-profile-pic.jpg" alt="" class='ImageFilter'>
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
    <h1 id='reccommendedMovies'>Reccommended Movies</h1>
  </div>

    <div class='castCrewMembers2' >

    <div v-for='(movie, index) in getPartialReccomended' :key='movie' class='castMember' @mouseenter.self='toggleHover(index)' @mouseleave.self='toggleHover(index)' >

      <div v-if='hover && currentlyShowing === index'> 
        <div class='pContainer2'>
        <p>{{movie.release_date.slice(0,4)}} </p>
        <p>{{movie.original_title}} </p>
        <button class='goToMovieBtn'>
        <router-link :to="{name: 'MovieDetails', params: {id: movie.id, fullMovie: movie}}">
              Go To Movie
          </router-link>
          </button>
    </div>

    </div>


    <img :src="baseImageURL + movie.poster_path" alt="" class='ImgHoverableSpacing' :class="{ 'imgHovered': hover && currentlyShowing === index}">
    </div>

  </div>
  </div>

</template>

<script>
import { useRoute } from 'vue-router'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import MovieInfo from '../components/MovieInfo.vue'



export default {
  name: 'MovieDetails',
  components: {
    MovieInfo
  },
  setup() {
    const route = useRoute()
    const getId = route.fullPath.slice(15)
    const getMovie = ref({})
    const baseImageURL = ref('https://image.tmdb.org/t/p/original/')
    const getCredits = ref({})
    const hamburgerOpen = ref(true)
    const getReccommended = ref({})
    const getMovieDetailsURL = ref(`https://api.themoviedb.org/3/movie/${getId}?api_key=${process.env.VUE_APP_APIKEY}&language=en-US`)
    const getCreditsURL = ref(`https://api.themoviedb.org/3/movie/${getId}/credits?api_key=${process.env.VUE_APP_APIKEY}&language=en-US`)
    const getReccommendedURL = ref(`https://api.themoviedb.org/3/movie/${getId}/recommendations?api_key=${process.env.VUE_APP_APIKEY}&language=en-US&page=1`)
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
    // a

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

#voteAverage {
  color: #f3b814; 
  font-size: 28px
}

#originalTitle {
  font-weight: bold; 
  font-size: 38px;
}

#characterName {
  font-weight: 300;
}

#voteCount {
  color: #8a6a11;
}

#voteStar {
  float: left; 
  color: orange; 
  margin-right: 10px
}

#movieOverview {
  margin-left: 330px; 
  margin-top: 30px;
}

#genreName {
  padding: 0 0 0 0;
}

#genresContainer {
  display: inline; 
  margin-left: 15px
}

#genreContainer {
  display: inherit;
}

#reccommendedMovies {
  margin-top: 50px;
}

#castLabel {
  position: absolute; 
  top: -5px; 
  z-index: 1; 
  font-weight: 400
}

#crewLabel {
  position: absolute; 
  top: -5px; 
  left: 688px; 
  z-index: 1; 
  font-weight: 400
}

.toggleHamburgerSpacing {
  position: absolute; 
  bottom: 55%;
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
  padding-top: 50px;
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
    padding: 0px 10px;
    display: inline;
    color: #fff;
    border-right: 0.1px solid #a3a2a2;
}

.movieInfo {
  text-align: left;
  display: inline;
  width: 100%;
  float: left;
  margin-top: 25%;
  margin-bottom: 5%;
  
  img {
    height: 500px; 
    width: 300px; 
    float: left; 
    margin-right: 20px
  }
}

</style>
