<template>
  <h1>About Page</h1>
</template>

<script>
import { useRoute } from 'vue-router'


export default {
  name: 'About',
  setup() {
    const route = useRoute()
    console.log(route.fullPath.slice(7))
    return {
    }
  }
}
</script>

<style>

</style>
