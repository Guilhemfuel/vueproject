import axios from 'axios'
import router from './../router'

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
    axios.get('http://www.quizforfun.fr/api/web/api/game/' + data)
      .then(function (response) {
        console.log(...response.data)
        context.commit('mutateIfGameExist', true)
      })
      .catch(function (error) {
        console.log(error.response.data.message)
        data = error.response.data.message
        context.commit('mutateData', data)
      })
  },
  newGame (context, data) {
    let game = {'nbPlayerMin': 3, 'nbPlayerMax': 10}

    axios({
      url: 'http://www.quizforfun.fr/api/web/api/game/new',
      method: 'post',
      data: game
    })
      .then(function (response) {
        console.log(response.data)
        router.push({name: 'Game', params: {code: response.data.code}})
      })
      .catch(function (error) {
        if (typeof error.response.data.message !== 'undefined') {
          console.log(error.response.data.message)
        }
      })
  },
  checkIfUserAlreadyInGame (context, data) {
    axios.get('http://www.quizforfun.fr/api/web/api/currentPlayerGame/' + data)
      .then(function (response) {
        console.log('A current game is available')
        console.log(response)
        context.commit('mutateIfAlreadyInGame', response.data.game.code)
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}

export default {namespaced: true, state, getters, mutations, actions}
