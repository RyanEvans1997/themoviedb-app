<template>
  <div class="home">

  <div class='firstMoviePosterBG' :style="
  {
    backgroundImage: 'url(' + firstMovieImg + ')'
  }
  ">   
  </div>
  <div v-if='hamburgerOpen' class='hamburger'>
    <i @click='toggleHamburger' class="fas fa-bars fa-2x" style='float: right'></i>
  </div>

  <div v-else class='hamburger'>
      <span class='dot'></span>
      <i @click='toggleHamburger' class="fas fa-times fa-2x" style='float: right'></i>
      <ul style='text-align: right; float:right'>
        <li>Popular</li>
        <li>Top Rated</li>
        <li>Upcoming</li>
      </ul>
  </div>

  <div class='firstMoviePoster'>
  <p style='font-size: 36px'>{{firstMovie.title}}</p>

  <div class='movieYear'>
    <p>{{firstMovieYear}}</p>
  </div>
  
  <div class='ratingAndBtn'>
    <star-rating :rating="firstMovieRating / 2" :star-size="15" :read-only='true' :border-width='1' :increment='0.5' :show-rating='false'></star-rating>

  <button class='goToMovieBtn'>Go To Movie</button>
  </div>

  <div class='justRating'>
  <p style='margin-right: 285px; padding-bottom: 20px'>
    Ratings
  </p>

  </div>
    
  </div>
  

  <div class='categories'>
    <h2 class='categoriesHeader'>Categories and Filters</h2>

    <ul class='categoriesList' v-for='category in categories' :key='category'>
      <li v-for='genre in category' :key='genre'>
              {{genre.name}}
      </li>
    </ul>
  </div>

  <div class='moviesSection'>
    <div class='formatMovies' v-for='(movie, index) in popularMovies.results' :key='movie'>
      <div class='formatMoviesHover' v-if='hover && currentlyShowing === index'>
        <p style='color:white;'>{{movie.release_date.slice(0,4)}} </p>
        <p style='color:white;'>{{movie.original_title}} </p>
        <button class='goToMovieBtn'>Go To Movie</button>
      </div>
      <img :src="'https://image.tmdb.org/t/p/w500/' + movie.poster_path" alt="" style='width:100%' @mouseover='toggleHover(index)' @mouseleave='toggleHover(index)' :class="{ 'imgHover': hover && currentlyShowing === index}">
    </div>
  </div>



  </div>
</template>

<script>
// @ is an alias to /src
import { ref, onMounted, computed } from 'vue'
import env from '@/env.js'
import axios from 'axios'
import StarRating from 'vue-star-rating'

export default {
  name: 'Home',
  components: {
    StarRating,
  },
  setup() {

    let firstMovie = ref('')
    let firstMovieImg = ref('')
    let firstMovieRating = ref('')
    let firstMovieYear = ref('')
    let hamburgerOpen = ref(true)
    let hover = ref(false)
    let currentlyShowing = ref(null)

    function toggleHover (index) {
        hover.value = !hover.value
        currentlyShowing.value = index
    }

    function toggleHamburger() {
      hamburgerOpen.value = !hamburgerOpen.value
    }


    let categories = ref([])
    let categoriesURL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${env.apikey}&language=en-US`
    let categoriesRequest = axios.get(categoriesURL)

    let popularMovies = ref([])
    let popularMoviesURL = `https://api.themoviedb.org/3/movie/popular?api_key=${env.apikey}&language=en-US&page=1`
    let popularMoviesRequest = axios.get(popularMoviesURL)

    onMounted(() => {
        axios.all([categoriesRequest, popularMoviesRequest])
        .then(axios.spread((data1, data2) => {
          categories.value = data1.data

          popularMovies.value = data2.data

          firstMovie.value = popularMovies.value.results[0]

          firstMovieImg.value = 'https://image.tmdb.org/t/p/original/' + popularMovies.value.results[0].poster_path
          firstMovieRating.value = popularMovies.value.results[0].vote_average

          firstMovieYear.value = popularMovies.value.results[0].release_date.slice(0, 4)     
        }))
        .catch(error => console.log(error))
    })

    return {
      categories,
      popularMovies,
      firstMovie,
      firstMovieImg,
      firstMovieRating,
      firstMovieYear,
      hamburgerOpen,
      toggleHamburger,
      hover,
      toggleHover,
      currentlyShowing
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

// img:hover {
//   filter: contrast(30%) brightness(60%) grayscale(100%);
// }

.imgHover {
  filter: contrast(30%) brightness(60%) grayscale(100%);
}

.firstMoviePoster {
  height: 450px;
  display: flex;
  padding: 20% 0;
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
  background-attachment: fixed;
  height: 80%;
  width: 100%;
  background-position: center;
  z-index: -1000;
  opacity: 0.4;
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

.justRating {
  display: flex;
  align-items: center;
  margin-bottom: 0px;

  button {
    margin-left: 200px;
  }
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

.topImage {
  width: 30%;
  height: 30%;
  opacity: 0.3;
}

.movies {
  width: 200px;
  height: 200px;
}

.dot {
  height: 400px;
  width: 400px;
  top: -150px;
  right: -150px;
  background-color: #274D74;
  border-radius: 50%;
  position: absolute;
  z-index: -1000;
  opacity: 0.8;
}

.movieYear {
  margin-top: 50px;
}

.formatMovies {
  position: relative;
  width: 25%;
  float: left;
  padding: 15px;
}

.formatMoviesHover {
  position: absolute;
  width: 200px;
  left: 18%;
  top: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100px;
  justify-content: space-between;
  z-index: 1000;
}

div.categories {
  background-color: #fff;
  color: #1c212e;
  display: flex;
  justify-content: space-between;
  font-weight: 300;
  width: 66%;
  margin-left: 16.65%;
  padding: 20px 20% 20px 0px;
}

.moviesSection {
  width: 66%;
  margin-left: 16.65%;
}

.imgHover {
  background-color: #fff;
  width: 500px;
}

.categoriesHeader {
  font-size: 48px;
  font-weight: normal;
  width: 300px;
}

.categoriesList {
  width: 300px;
  list-style: none;
  columns: 3;
}

.goToMovieBtn {
  background: none;
  border: #f3b814 1px solid;
  padding: 5px;
  border-radius: 4px;
  color: #f3b814;
}

</style>
