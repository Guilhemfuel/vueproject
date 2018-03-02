import axios from 'axios'

const state = {
  game: '',
  errorMessage: '',
  players: []
}

const getters = {
  getGame: function (state) { return state.game },
  getErrorMessage: function (state) { return state.errorMessage },
  getPlayers: function (state) { return state.players }
}

const mutations = {
  mutateGame: (state, data) => {
    state.game = data
  },
  mutateErrorMessage: (state, data) => {
    state.errorMessage = data
  },
  mutatePlayers: (state, data) => {
    state.players = data
  },
  addPlayer: (state, data) => {
    state.players.push(data)
  }
}

const actions = {
  setGame (context, data) {
    context.commit('mutateGame', data)

    axios.get('http://www.quizforfun.fr/api/web/api/game/' + data)
      .then(function (response) {
        let players = response.data[0]['players']
        console.log(response.data[0])
        context.commit('mutateGame', response.data[0])
        context.commit('mutatePlayers', players)
      })
      .catch(function (error) {
        data = error.response
        context.commit('mutateErrorMessage', data)
      })
  },
  addPlayer (context, data) {
    let player = {'name': data, 'owner': '', 'score': 0, 'game': state.game.id}

    axios({
      url: 'http://www.quizforfun.fr/api/web/api/player/new',
      method: 'post',
      data: player
    })
      .then(function (response) {
        console.log(response.data)
        context.commit('addPlayer', response.data)
      })
      .catch(function (error) {
        if (typeof error.response.data.message !== 'undefined') {
          context.commit('mutateErrorMessage', error.response.data.message)
          console.log(error.response.data.message)
        }
      })
  }
}

export default {namespaced: true, state, getters, mutations, actions}
