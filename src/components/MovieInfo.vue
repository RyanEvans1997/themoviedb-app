<template>
    <div class='movieInfo'>
    <img :src="baseImageURL + getMovie.poster_path" alt="">
    <p id='originalTitle'>{{getMovie.original_title}}</p>
    <i id='voteStar' class="fas fa-star fa-3x"></i>
    <p id='voteAverage'>{{getMovie.vote_average}}</p>
    <p id='voteCount'>{{getMovie.vote_count}} votes</p>
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
      <div id='genresContainer'>
        <div id='genreContainer' v-for='(genre, index) in getMovie.genres' :key='genre'>
        <li v-if='index != Object.keys(getMovie.genres).length - 1' class='genreName'>
          {{genre.name}},
        </li>
        <li v-else class='genreName'>
           {{genre.name}}
        </li>
      </div>
      </div>

      </ul>

    <p id='movieOverview'>{{getMovie.overview}}</p>
  </div>
</template>

<script>
export default {
  name: 'MovieInfo',
  props: ['getMovie', 'baseImageURL', 'getMovieYear', 'getMovieRunning']
}
</script>

<style>

</style>