import axios from 'axios'
import router from './../router'
import config from '../config'

const api = config.dev

const state = {
  data: '',
  ifGameExist: false,
  ifAlreadyInGame: false
}

const getters = {
  getData: function (state) { return state.data },
  getIfGameExist: function (state) { return state.ifGameExist },
  getIfAlreadyInGame: function (state) { return state.ifAlreadyInGame }
}

const mutations = {
  mutateData: (state, data) => {
    state.data = data
  },
  mutateIfGameExist: (state, data) => {
    state.ifGameExist = data
  },
  mutateIfAlreadyInGame: (state, data) => {
    state.ifAlreadyInGame = data
  }
}

const actions = {
  setData (context, data) {
    axios.get(api + '/game/' + data.toUpperCase())
      .then(response => {
        context.commit('mutateIfGameExist', true)
      })
      .catch(error => {
        console.log(error.response.data.message)
        data = error.response.data.message
        context.commit('mutateData', data)
      })
  },
  newGame (context, data) {
    let game = {'nbPlayerMin': 2, 'nbPlayerMax': 10}

    axios({
      url: api + '/game/new',
      method: 'post',
      data: game
    })
      .then(response => {
        window.localStorage.setItem('owner', response.data.code) // Set the user owner of the game
        router.push({name: 'Game', params: {code: response.data.code}})
      })
      .catch(error => {
        if (typeof error.response.data.message !== 'undefined') {
          console.log(error.response.data.message)
        }
      })
  },
  checkIfUserAlreadyInGame (context, data) {
    axios.get(api + '/currentPlayerGame/' + data)
      .then(response => {
        console.log('A current game is available')
        context.commit('mutateIfAlreadyInGame', response.data.game.code)
      })
      .catch(error => {
        console.log(error.response.data)
      })
  }
}

export default {namespaced: true, state, getters, mutations, actions}
