import axios from 'axios'
import config from '../config'

const api = config.dev

const state = {
  game: '',
  errorMessage: '',
  fingerprint: '',
  players: []
}

const getters = {
  getGame: function (state) { return state.game },
  getErrorMessage: function (state) { return state.errorMessage },
  getFingerprint: function (state) { return state.fingerprint },
  getPlayers: function (state) { return state.players }
}

const mutations = {
  mutateGame: (state, data) => {
    state.game = data
  },
  mutateErrorMessage: (state, data) => {
    state.errorMessage = data
  },
  mutateFingerprint: (state, data) => {
    state.fingerprint = data
  },
  mutatePlayers: (state, data) => {
    state.players = data
  },
  addPlayer: (state, data) => {
    state.players.push(data)
  }
}

const actions = {
  initGame (context, data) {
    axios.get(api + '/game/' + data)
      .then(function (response) {
        let players = response.data[0]['players']
        console.log(response.data[0])
        context.commit('mutateGame', response.data[0])
        context.commit('mutatePlayers', players)
      })
      .catch(function (error) {
        data = error.response.data.message
        context.commit('mutateErrorMessage', data)
      })
  },
  setGame (context, data) {
    context.commit('mutateGame', data)
    context.commit('mutatePlayers', data['players'])
  },
  setFingerprint (context, data) {
    context.commit('mutateFingerprint', data)
  },
  addPlayer (context, data) {
    let player = {'name': data, 'fingerprint': state.fingerprint, 'owner': '', 'score': 0, 'game': state.game.id}

    axios({
      url: api + '/player/new',
      method: 'post',
      data: player
    })
      .then(function (response) {
        console.log(response.data)
        context.commit('addPlayer', response.data)
        context.commit('mutateErrorMessage', '')

        axios(api + '/refreshGame/' + state.game.code)
      })
      .catch(function (error) {
        if (typeof error.response.data.message !== 'undefined') {
          context.commit('mutateErrorMessage', error.response.data.errors.children)
          console.log(error.response.data.errors.children.name.errors)
        }
      })
  },
  checkIfUserAlreadyInGame (context, data) {
    axios.get(api + '/currentPlayerGame/' + data.fingerprint)
      .then(function (response) {
        console.log('A previous game was active')
        // Si le joueur (basé sur le fingerprint) était dans une autre partie on supprime l'ancienne entrée
        if (response.data.game.code !== data.code) {
          axios.delete(api + '/player/remove/' + response.data.id)
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }
/*
  ✓ On récupère les infos de game
  ✓ Si la personne n'a aucun cookie de session de jeu on lui propose d'écrire son pseudo
  ✓ Si la personne a un cookie on récupère son pseudo et ses infos

  On check également le statut de la partie :
  Est ce que la partie a déjà atteint le nombre de joueurs max
  Est ce que la partie est en attente pour commencer (0), en cours (1), ou finie (2) ?

  Si le joueur est owner de la partie on affiche un bouton de lancement
  sinon les joueurs sont en attente

  Ensuite lancement de la partie on affiche le composant Questionnaire

  Indentification unique : fingerprint
  Et websocket temps reel : sse
*/
}

export default {namespaced: true, state, getters, mutations, actions}
