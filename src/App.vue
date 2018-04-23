<template>
  <div id="app">
    <router-link :to="{ name: 'Home' }" id="link-logo"><div id="logo">QuizForFun</div></router-link>
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

  #link-logo {
    text-decoration: none;
  }

  #logo {
    font-family: 'Montserrat', sans-serif;
    color: white;
    font-size: 2.8em;
    text-decoration: none;
    height: 12%;
    font-weight: 700;
    font-style: italic;
  }

  .form {
    padding: 0px;
  }
</style>
