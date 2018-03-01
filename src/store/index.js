import Vue from 'vue'
import Vuex from 'vuex'
import codegame from './codegame.js'
import game from './game.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    codegame, game
  }
})

export default store
