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
        context.commit('mutateErrorMessage', '')
      })
      .catch(function (error) {
        if (typeof error.response.data.message !== 'undefined') {
          context.commit('mutateErrorMessage', error.response.data.message)
          console.log(error.response.data.message)
        }
      })
  }
/*
  On récupère les infos de game
  Si la personne n'a aucun cookie de session de jeu on lui propose d'écrire son pseudo
  Si la personne a un cookie on récupère son pseudo et ses infos

  Quand le joueur ajoute son pseudo on vérifie si il existe déjà
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
