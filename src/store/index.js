import Vue from 'vue'
import Vuex from 'vuex'
import home from './home.js'
import game from './game.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    home, game
  }
})

export default store
