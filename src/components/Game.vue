<template>
  <div id="Game" v-if="getGame !== ''">
    <transition name="fade">
      <div id="Player" v-if="getPlayer === false">
        <input-player></input-player>
      </div>
    </transition>
    <p v-if="getOwner === true && getGame.isStarted === false">
      Partagez ce code : {{ getGame.code }}<br />
      <br />
      <button type="button" v-on:click="startGame" v-bind:class="{ active: readyToStart }" v-bind:disabled="!readyToStart">Lancer la partie !</button>
    </p>
    <div v-if="getGame.isStarted === true">
      <questions @status="triggerTimer()" ref="questionsComponent"></questions>
      <timer :timer="time" @status="endTimer(true)" ref="timerComponent"></timer>
    </div>
    <players></players>
  </div>
  <div class="errorMessage" v-else>
    {{ getErrorMessage }}
  </div>
</template>

<script>
import InputPlayer from './InputPlayer.vue'
import Players from './Players.vue'
import Questions from './Questions.vue'
import Timer from './Timer.vue'
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
    Timer
  },
  name: 'Game',
  data () {
    return {
      time: 5
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
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
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
</style>
