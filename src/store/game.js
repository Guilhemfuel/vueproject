import axios from 'axios'
import config from '../config'

const api = config.prod

const state = {
  game: '',
  errorMessage: '',
  fingerprint: '',
  players: [],
  player: false,
  owner: false,
  idPlayer: false,
  questions: []
}

const getters = {
  getGame: function (state) { return state.game },
  getErrorMessage: function (state) { return state.errorMessage },
  getFingerprint: function (state) { return state.fingerprint },
  getPlayers: function (state) { return state.players },
  getPlayer: function (state) { return state.player },
  getOwner: function (state) { return state.owner },
  getIdPlayer: function (state) { return state.idPlayer },
  getQuestions: function (state) { return state.questions }
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
  mutatePlayer: (state, data) => {
    state.player = data
  },
  mutateOwner: (state, data) => {
    state.owner = data
  },
  mutateIdPlayer: (state, data) => {
    state.idPlayer = data
  },
  mutateQuestions: (state, data) => {
    state.questions = data
  },
  addPlayer: (state, data) => {
    state.players.push(data)
  }
}

const actions = {
  initGame (context, data) {
    axios.get(api + '/game/' + data)
      .then(response => {
        let players = response.data[0]['players']
        let questions = JSON.parse(response.data[0]['questions'])
        context.commit('mutateGame', response.data[0])
        context.commit('mutatePlayers', players)
        context.commit('mutateQuestions', questions)

        // Récupérer l'ID de l'utilisateur en cours
        players.forEach(function (element) {
          if (element.fingerprint === localStorage.getItem('fingerprint')) {
            context.commit('mutateIdPlayer', element.id)
          }
        })

        // Si l'utilisateur a crée la partie on set le status Owner
        if (localStorage.getItem('owner') === data) {
          context.commit('mutateOwner', true)
        } else {
          window.localStorage.removeItem('owner')
        }
      })
      .catch(error => {
        data = error.response.data.message
        context.commit('mutateErrorMessage', data)
      })
  },
  checkIfUserAlreadyInGame (context, data) {
    axios.get(api + '/currentPlayerGame/' + data.fingerprint)
      .then(response => {
        console.log('A previous game was active')
        // Si le joueur était dans une autre partie on supprime l'ancienne entrée
        if (response.data.game.code !== data.code) {
          axios.delete(api + '/player/remove/' + response.data.id)
          context.commit('mutatePlayer', false)
        } else {
          context.commit('mutatePlayer', true)
        }
      })
      .catch(error => {
        console.log(error.response)
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
    let player = {'name': data, 'fingerprint': state.fingerprint, 'owner': state.owner, 'score': 0, 'game': state.game.id}

    axios({
      url: api + '/player/new',
      method: 'post',
      data: player
    })
      .then(response => {
        context.commit('mutateIdPlayer', response.data.id)
        context.commit('addPlayer', response.data)
        context.commit('mutatePlayer', true)
        context.commit('mutateErrorMessage', '')

        axios(api + '/refreshGame/' + state.game.code)
      })
      .catch(error => {
        if (typeof error.response.data.message !== 'undefined') {
          context.commit('mutateErrorMessage', error.response.data.errors.children)
          console.log(error.response.data.errors.children.name.errors)
        }
      })
  }
/*
  Récupération des infos de game
  A partir de son fingerprint on essaye de récupérer ses infos
  On se sert de checkIfUserAlreadyInGame puis on compare les codes
  Si le joueur était dans une autre partie on le supprime
  Sinon on initialise la variable Player à true
  Cette variable va permettre de savoir si l'utilisateur est bien rentré dans la partie

  Si c'est un nouvel utilisateur on affiche le formulaire, une fois le joueur bien ajouté
  on efface le formulaire

  On check également le statut de la partie :
  Est ce que la partie a déjà atteint le nombre de joueurs max
  Est ce que la partie est en attente pour commencer (0), en cours (1), ou finie (2) ?

  Si le joueur est owner de la partie on affiche un bouton de lancement
  sinon les joueurs sont en attente

  Lancement de partie :
  On envoie sur pusher le status de la game à tout le monde
  On lance un compteur de 5sec
  L'API doit choisir les questions pour que tout le monde ai les même
  Elles seront enregistré dans un champ sous forme de JSON
  Quand on charge la partie, toutes les questions sont chargé avec

  On affiche la première question au bout du décompte
  Dés qu'un joueur sélectionne une réponse le timer se lance sur 20sec
  A la fin du timer les réponses sont envoyé à l'API qui va s'occuper d'attribuer les points
  On laisse un délai puis

  Websocket temps reel : sse
*/
}

export default {namespaced: true, state, getters, mutations, actions}
