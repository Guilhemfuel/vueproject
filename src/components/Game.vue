<template>
  <div id="Game" v-if="getGame !== ''">
    <transition name="fade">
      <div id="Player" v-if="getPlayer === false">
        <input-player></input-player>
      </div>
    </transition>
    <p v-if="getOwner === true && getGame.isStarted === false">
      Partagez ce code : {{ getGame.code }} !
      <br />
      <br />
      <button type="button" v-on:click="startGame" v-bind:class="{ active: readyToStart }" v-bind:disabled="!readyToStart">Lancer la partie !</button>
    </p>
    <players></players>
    <div v-if="getGame.isStarted === true">
      <questions @status="triggerTimer()"></questions>
      <timer :timer="time" @status="endTimer(true)" ref="timerComponent"></timer>
    </div>
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
      time: 5,
      statusTimer: false,
      userHasAnswered: false
    }
  },
  methods: {
    triggerTimer () {
      if (!this.userHasAnswered) {
        this.userHasAnswered = true
        axios(api + '/game/startTimer/' + this.getGame.code)
      }
      // On declenche le timer à chaque fois qu'un joueur est le premier à répondre
      // Ce qui veut dire qu'on a un status de timer à FALSE
      // Si on répond et que le status est FALSE on le change à true
      // On envoie une notif à tout les joueurs pour passer à TRUE
      // A la fin du Timer on change de question
    },
    ...mapActions({
      initGame: 'game/initGame',
      setGame: 'game/setGame',
      setFingerprint: 'game/setFingerprint',
      checkIfUserAlreadyInGame: 'game/checkIfUserAlreadyInGame'
    }),
    startGame: function () {
      console.log('Start the game with API')
      axios.get(api + '/game/start/' + this.getGame.code)
        .then(response => {
          axios(api + '/refreshGame/' + this.getGame.code)
        })
    },
    endTimer: function (value) {
      this.statusTimer = false
      this.userHasAnswered = false
      this.$refs.timerComponent.resetComponent()
      console.log(this.userHasAnswered)
      console.log('End of Timer')
      console.log(this.time)
      // Code a executer après la fin du Timer seulement pour le créateur de la partie
      if (this.getOwner) {
        console.log('Im the owner')
        axios.get(api + '/game/nextQuestion/' + this.getGame.code)
          .then(response => {
            axios(api + '/refreshGame/' + this.getGame.code)
          })
      }
    }
  },
  computed: {
    ...mapGetters({
      getGame: 'game/getGame',
      getPlayer: 'game/getPlayer',
      getQuestions: 'game/getQuestions',
      getOwner: 'game/getOwner',
      getErrorMessage: 'game/getErrorMessage',
      getFingerprint: 'game/getFingerprint'
    }),
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
      let obj = JSON.parse(data)
      self.setGame(obj)
    })

    channel.bind('timer', (data) => {
      console.log(data)
      if (data) {
        console.log(this.$refs)
        this.userHasAnswered = true
        this.$refs.timerComponent.startTimer()
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
</style>
