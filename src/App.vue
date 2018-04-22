<template>
  <div id="app">
    <router-link :to="{ name: 'Home' }"><img src="./assets/logo.png"></router-link>
    <router-view/>
  </div>
</template>

<script>
import Home from './components/Home.vue'

export default {
  components: {
    Home
  },
  name: 'App'
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.form {
  padding: 0px;
}
</style>
