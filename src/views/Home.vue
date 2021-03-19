<template>
  <div class='firstMoviePosterBG' 
  :style="{
    backgroundImage: 'url(' + firstMovieImg + ')', 
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    maxWidth: '2700px'
  }">   
  </div>

  <div class="container">

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

  <div class='firstMoviePoster'>
  <p id='firstMovieTitle'>{{firstMovie.title}}</p>

  <div class='movieYear'>
    <p>{{firstMovieYear}}</p>
  </div>
  
  <div class='ratingAndBtn'>
    <star-rating :rating="firstMovieRating / 2" :star-size="15" :read-only='true' :border-width='1' :increment='0.5' :show-rating='false'></star-rating>

  <button class='goToMovieBtn'>
          <router-link :to="{name: 'MovieDetails', params: {id: firstMovie.id, fullMovie: firstMovie}}">
              Go To Movie
            </router-link>
          </button>
  </div>

  <div id='firstMovieRating'>
  <p>
    Ratings
  </p>

  </div>
    
  </div>
  

  <div class='categories'>
    <h2 class='categoriesHeader'>Categories &amp; Filters</h2>

    <ul class='categoriesList' v-for='category in categories' :key='category'>
      <li v-for='genre in category' :key='genre'>
            <div class='currentGenre' >
              <router-link v-if='genre.name === currentGenre' :to="{name: 'Home', params: {sortBy: genre.name.replace(' ', '-').toLowerCase()}}" replace class='activeGenre'>
                {{genre.name + ' >'}}
              </router-link>
              <router-link v-else-if='genre.name.toLowerCase() === route.fullPath.slice(1) || ("top-rated" === route.fullPath.slice(1) && genre.name.toLowerCase() === "top rated")' :to="{name: 'Home', params: {sortBy: genre.name.replace(' ', '-').toLowerCase()}}" replace class='activeGenre'>
                {{genre.name + ' >'}}
              </router-link>
              <router-link v-else :to="{name: 'Home', params: {sortBy: genre.name.replace(' ', '-').toLowerCase()}}" replace>
                {{genre.name}}
              </router-link>
            </div>
      </li>
    </ul>
  </div>

  <div class='moviesSection'>
    <div class='formatMovies' v-for='(movie, index) in sortByMovies.results' :key='movie' @mouseenter.self='toggleHover(index)' @mouseleave.self='toggleHover(index)' >
      <div class='formatMoviesHover' v-if='hover && currentlyShowing === index'>
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

      <div>
      <img :src="'https://image.tmdb.org/t/p/w500/' + movie.poster_path" alt="" :class="{ 'imgHovered': hover && currentlyShowing === index}" style='width: 280px;'>
      </div>
    </div>
  </div>



  </div>
</template>

<script>
// @ is an alias to /src
import { ref, onMounted, onUpdated} from 'vue'
import env from '@/env.js'
import axios from 'axios'
import StarRating from 'vue-star-rating'
import { useRoute } from 'vue-router'

export default {
  name: 'Home',
  components: {
    StarRating,
  },
  setup() {
    const route = useRoute()
    let firstMovie = ref('')
    let firstMovieImg = ref('')
    let firstMovieRating = ref('')
    let firstMovieYear = ref('')
    let hamburgerOpen = ref(true)
    let hover = ref(false)
    let currentlyShowing = ref(null)
    let currentSortBy = ref(route.fullPath.slice(1))
    let currentGenre = ref('All Movies')
    let sortBy = ref('')
    let sortByFilters = ref(['popular', 'top rated', 'upcoming'])
    let sortByMovies = ref([])
    let sortByRequest = ref([])
    let categories = ref([])
    let categoriesURL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${env.apikey}&language=en-US`
    let categoriesRequest = axios.get(categoriesURL)
    let popularMoviesURL = `https://api.themoviedb.org/3/movie/popular?api_key=${env.apikey}&language=en-US&page=1`
    let topRatedMoviesURL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${env.apikey}&language=en-US&page=1`
    let upcomingMoviesURL = `https://api.themoviedb.org/3/movie/upcoming?api_key=${env.apikey}&language=en-US&page=1`
  
    sortBy.value = route.params.sortBy;

    function toggleHover (index) {
        hover.value = !hover.value
        currentlyShowing.value = index
    }

    function toggleHamburger() {
      hamburgerOpen.value = !hamburgerOpen.value
      
    }

    function getCategoryListItem() {
      if(route.fullPath.slice(1) === 'popular' || route.fullPath.slice(1) === 'top-rated' ||
      route.fullPath.slice(1) === 'upcoming') {
        currentSortBy.value = route.fullPath.slice(1)
        getCurrentSortBy()
        getNewSortBy()
      } else {
        currentGenre.value = route.fullPath.slice(1)
      }
    }

    function getCurrentSortBy() {
        if(route.fullPath.slice(1) == 'popular') {
        sortByRequest = axios.get(popularMoviesURL)
        // console.log('Getting popular')
      } else if (route.fullPath.slice(1) == 'top-rated') {
        sortByRequest = axios.get(topRatedMoviesURL)
        // console.log('Getting Top Rated')
      } else if (route.fullPath.slice(1) == 'upcoming') {
        sortByRequest = axios.get(upcomingMoviesURL)
        // console.log('Getting Upcoming')
      }
      currentSortBy.value = route.fullPath.slice(1)
    }

    getCurrentSortBy()

    function getNewSortBy() {
      axios.all([categoriesRequest, sortByRequest])
      .then(axios.spread((data1, data2) => {
        // console.log(data1.data)
        // console.log(data2.data)
        sortByMovies.value = data2.data
        getCategoryListItem()

        firstMovie.value = sortByMovies.value.results[0]

        firstMovieImg.value = 'https://image.tmdb.org/t/p/original/' + sortByMovies.value.results[0].poster_path
        firstMovieRating.value = sortByMovies.value.results[0].vote_average

        firstMovieYear.value = sortByMovies.value.results[0].release_date.slice(0, 4)     
      }))
      .catch(error => console.log(error))
    }

    onMounted(() => {
        axios.all([categoriesRequest, sortByRequest])
        .then(axios.spread((data1, data2) => {
          categories.value.push([{name: 'Popular'}, {name: 'Top Rated'}, {name: 'Upcoming'}].concat(data1.data.genres.slice(0, 11).concat({name: 'All Movies'})))

          sortByMovies.value = data2.data

          firstMovie.value = sortByMovies.value.results[0]

          firstMovieImg.value = 'https://image.tmdb.org/t/p/original/' + sortByMovies.value.results[0].poster_path
          firstMovieRating.value = sortByMovies.value.results[0].vote_average

          firstMovieYear.value = sortByMovies.value.results[0].release_date.slice(0, 4)     
        }))
        .catch(error => console.log(error))
    })

    return {
      route,
      categories,
      firstMovie,
      firstMovieImg,
      firstMovieRating,
      firstMovieYear,
      hamburgerOpen,
      toggleHamburger,
      hover,
      toggleHover,
      currentlyShowing,
      currentSortBy,
      currentGenre,
      getCategoryListItem,
      sortByMovies,
      sortByFilters
      }
  }
}
</script>

<style lang='scss'>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto' , sans-serif;
}

body {
  background-color: #1c212e;
  color: #fff; 
}

#firstMovieTitle {
  font-size: 36px;
}


a {
  text-decoration: none;
  color: #1c212e;
  font-weight: 400;
}

.categoriesHeader {
  font-size: 48px;
  font-weight: normal;
  width: 300px;
}

.categoriesList {
  list-style: none;
  columns: 3;
  li {
    margin: 3px 35px 3px 0px;
    text-align: left;
  }

  a {
    cursor: pointer;
  }

  .activeGenre {
    color: #5F84EF;
  }
}

.currentGenre {
  color: #5F84EF;
}

div.categories {
  background-color: #fff;
  color: #1c212e;
  display: flex;
  justify-content: space-between;
  font-weight: 300;
  margin: 0 auto;
  padding: 20px 20% 20px 0px;
}

.firstMoviePoster {
  height: 450px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  opacity: 1;
  z-index: 1000;

  p {
    color: #fff;
    text-transform: uppercase;
    padding: auto;
  }
}

.firstMoviePosterBG {
  position: fixed;
  height: 480px;
  width: 3000px;
  opacity: 0.4;
}

.formatMovies {
  margin-top: 40px;
  position: relative;
}

.moviesSection {
  width: 1215px;
  flex-wrap: wrap;
  display: flex;
  justify-content: space-between;
}

.formatMoviesHover {
  display: flex;
  position: absolute;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  bottom: 100px;
  left: 45px;
  width: 200px;
  z-index: 1000;
}

.pContainer2 {
    display: flex;
    position: absolute;
    align-items: center;
    flex-direction: column;
    justify-content: space-around;
    bottom: 50px;
    left: 10px;
    width: 180px;
    height: 150px;
    z-index: 1; 
}

.goToMovieBtn {
  background: none;
  border: #f3b814 1px solid;
  padding: 5px;
  border-radius: 4px;
  color: #f3b814;
  text-decoration: none;

  a {
    color: #f3b814; 
    text-decoration: none;
  }
}

.hamburger {
  color: #fff;
  max-width: 1000px;
  position: absolute;
  right: -410px;
  top: -80px;
  opacity: 0.8;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  
  ul {
    list-style-type: none;
    text-align: right; 
    position: absolute; 
    bottom: 18%; 
    left: 30%
  }
  li {
    padding: 8px;
    margin: 2px 0px;
  }
}


.container {
  margin-left: 16.66%;
  width: 66%;
  max-width: 1264px;
  position: relative;
}

.hamburger:hover {
  cursor: pointer;
}

.imgHovered {
  filter: contrast(30%) brightness(60%) grayscale(100%);
}

.ImgHoverableSpacing {
  display: inline-block; 
  width: 200px; 
  height: 300px;
}

.ratingAndBtn {
  display: flex;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 0px;

  button {
    margin-left: 200px;
  }
}

#firstMovieRating {
  display: flex;
  align-items: center;
  margin-bottom: 0px;

  button {
    margin-left: 200px;
  }

  p {
    margin-right: 285px; 
    padding-bottom: 20px
  }
}

.topImage {
  width: 30%;
  height: 30%;
  opacity: 0.3;
}

.movies {
  width: 200px;
  height: 200px;
}

.movieYear {
  margin-top: 50px;
}

</style>
