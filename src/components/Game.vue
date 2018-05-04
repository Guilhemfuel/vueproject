<template>
  <div id="Game" v-if="getGame !== ''">
    <popup v-if="showModal" @close="showModal = false"></popup>
    <transition name="fade">
      <div id="Player" v-if="getPlayer === false">
        <input-player></input-player>
      </div>
    </transition>
    <div id="code-partage" v-if="getOwner === true && getGame.isStarted === false">
      <span id="code">{{ getGame.code }}</span>
      <br />
      <span>Partagez ce code à vos amis !</span><br />
      <button type="button" v-on:click="startGame" v-bind:class="{ active: readyToStart }" v-bind:disabled="!readyToStart">Lancer la partie !</button>
    </div>
    <div id="game-content" v-if="getGame.isStarted === true">
      <questions @status="triggerTimer()" ref="questionsComponent"></questions>
      <timer :timer="time" @status="endTimer(true)" ref="timerComponent"></timer>
    </div>
    <div v-if="getGame.isStarted === true">
      <div id="show-players" @click="showModal = true"><img src="./../assets/players.png"/></div>
    </div>
    <div v-else>
      <players></players>
      <div>
        <loader></loader>
        <span class="white size-0-8em">En attente de joueurs...</span>
      </div>
    </div>
  </div>
  <div class="errorMessage" v-else>
    <div v-if="getErrorMessage === ''">
      <loader></loader>
      <span class="white size-0-8em">Chargement de la partie...</span>
    </div>
    <div v-else>
      {{ getErrorMessage }}
    </div>
  </div>
</template>

<script>
import InputPlayer from './InputPlayer.vue'
import Players from './Players.vue'
import Questions from './Questions.vue'
import Timer from './Timer.vue'
import Loader from './Loader.vue'
import Popup from './Popup.vue'
import {mapGetters, mapActions} from 'vuex'
import Fingerprint2 from 'fingerprintjs2'
import Pusher from 'pusher-js'
import axios from 'axios'
import config from '../config'

const api = config.dev

export default {
  components: {
    Questions,
    InputPlayer,
    Players,
    Timer,
    Loader,
    Popup
  },
  name: 'Game',
  data () {
    return {
      time: 5,
      showModal: false
    }
  },
  methods: {
    ...mapActions({
      initGame: 'game/initGame',
      setGame: 'game/setGame',
      setFingerprint: 'game/setFingerprint',
      checkIfUserAlreadyInGame: 'game/checkIfUserAlreadyInGame'
    }),
    startGame: function () {
      console.log('Start the Game')
      axios.get(api + '/game/start/' + this.getGame.code)
        .then(response => {
          this.refreshGame()
        })
    },
    triggerTimer () {
      // On declenche le timer à chaque fois qu'un joueur est le premier à répondre
      axios(api + '/game/startTimer/' + this.getGame.code)
    },
    endTimer: function (value) {
      // On soumet la réponse à l'API
      this.submitAnswer(this.$refs.questionsComponent.checked)
      // On affiche la bonne réponse
      this.$refs.questionsComponent.showGoodAnswer()
      // Code a executer après la fin du Timer seulement pour le créateur de la partie
      if (this.getOwner) {
        axios.get(api + '/game/nextQuestion/' + this.getGame.code)
          .then(response => {
            setTimeout(this.refreshGame, 5000)
          })
      }
    },
    submitAnswer (question) {
      axios.get(api + '/game/submitAnswer/' + this.getIdPlayer + '/' + question)
        .then(response => {
          console.log(response)
        })
    },
    refreshGame () {
      axios(api + '/refreshGame/' + this.getGame.code)
    }
  },
  computed: {
    ...mapGetters({
      getGame: 'game/getGame',
      getPlayer: 'game/getPlayer',
      getQuestions: 'game/getQuestions',
      getOwner: 'game/getOwner',
      getErrorMessage: 'game/getErrorMessage',
      getIdPlayer: 'game/getIdPlayer',
      getFingerprint: 'game/getFingerprint'
    }),
    // On affiche le bouton de lancement de partie si le nombre minimum de joueurs est atteint
    readyToStart: function () {
      if (this.getGame.players.length >= this.getGame.nbPlayerMin) {
        return true
      }
    }
  },
  created () {
    let self = this
    // Création et stockage d'un fingerprint en localStorage
    new Fingerprint2().get(function (result, components) {
      if (localStorage.getItem('fingerprint') === null) {
        window.localStorage.setItem('fingerprint', result)
      }

      self.setFingerprint(localStorage.getItem('fingerprint')) // On set le fingerprint dans le store

      let data = {fingerprint: self.getFingerprint, code: self.$route.params.code}
      self.checkIfUserAlreadyInGame(data) // On check si l'utilisateur était dans une autre partie
    })
    // Instantiate the game
    this.initGame(this.$route.params.code)
  },
  mounted () {
    let self = this
    // Pusher.logToConsole = true
    let pusher = new Pusher('b1ed0160cc1033ce4f54', {
      cluster: 'eu'
    })

    let channel = pusher.subscribe(this.$route.params.code)
    channel.bind('game', function (data) {
      if (typeof self.$refs.timerComponent !== 'undefined') {
        self.$refs.timerComponent.resetComponent()
        self.$refs.questionsComponent.resetComponent()
      }
      let obj = JSON.parse(data)
      self.setGame(obj)
    })

    channel.bind('timer', (data) => {
      if (data) {
        if (typeof self.$refs.timerComponent !== 'undefined') {
          self.$refs.timerComponent.startTimer()
        }
      }
    })
  }
}
</script>

<style scoped>
  #Game {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  #game-content {
    flex-grow:1;
  }

  #show-players {
    margin: 0 auto;
    width: 10%;
  }

  #show-players img {
    width: 100%;
  }

  #code-partage {
    line-height: 2em;
    color: white;
  }

  #code {
    font-family: 'Montserrat', sans-serif;
    color: #dd9d22;
    font-weight: 600;
    font-size: 2em;
  }

  button {
    color: #868686;
    background-color: #5a5a5a;
    border: none;
    padding: 10px;
  }

  .active {
    background-color: #383838;
    color: #42a2ff;
    cursor: pointer;
  }

  .active:hover {
    color: white;
  }

  .errorMessage {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
  }
</style>
