import Vue from 'vue'
import Vuex from 'vuex'
import codegame from './codegame.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    codegame
  }
})

export default store
