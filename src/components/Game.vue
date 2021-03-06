<template>
  <div id="Game" v-if="getGame !== ''">
    <popup v-if="showModal" @close="showModal = false">
      <slot slot="title">Joueurs</slot>
      <p slot="content"></p>
    </popup>
    <popup-exit v-if="showModalExit" @close="showModalExit = false" @exit="exitGame()">
      <slot slot="title">Voulez-vous quitter la partie ?</slot>
      <p slot="content"></p>
    </popup-exit>
    <transition name="fade">
      <div id="Player" v-if="getPlayer === false && !getGame.isFinished">
        <input-player></input-player>
      </div>
    </transition>
    <div id="code-partage" v-if="getOwner === true && getGame.isStarted === false">
      <span class="code">{{ getGame.code }}</span>
      <br />
      <span>Partagez ce code à vos amis !</span><br />
      <button type="button" v-on:click="startGame" v-bind:class="{ active: readyToStart }" v-bind:disabled="!readyToStart">Lancer la partie !</button>
    </div>
    <div id="game-content" v-if="getGame.isStarted === true && getIdPlayer && !getGame.isFinished">
      <div id="content-questions">
        <questions @status="triggerTimer()" ref="questionsComponent"></questions>
        <timer :timer="time" @status="endTimer(true)" ref="timerComponent"></timer>
        <transition name="slide-fade">
          <div id="notification" v-if="notification" :class="notificationCss">{{ notification }}</div>
        </transition>
      </div>
      <div class="footer-icon">
        <div></div>
        <div class="show-players" @click="showModal = true"><img src="./../assets/players.png"/></div>
        <div class="exit" @click="showModalExit = true"><img src="./../assets/exit.png"/></div>
      </div>
    </div>
    <div id="scoreboard" v-else-if="getGame.isFinished === true">
      <div style="flex-grow: 1;">
        <span class="code">Partie Terminée !</span>
        <div class="scores"><img src="./../assets/trophy.png"/></div>
        <ul>
          <li v-for="(player) in orderPlayers" :key="player.id">
            <p><span>{{ player.name }}</span><span>{{ player.score }}</span></p>
          </li>
        </ul>
      </div>
      <div class="footer-icon">
        <div></div>
        <div class="show-players" @click="showModal = true"><img src="./../assets/players.png"/></div>
        <div class="exit" @click="showModalExit = true"><img src="./../assets/exit.png"/></div>
      </div>
    </div>
    <div v-else>
      <players></players>
      <div v-if="getGame.isStarted === false">
        <loader></loader>
        <span class="white size-0-8em">En attente de joueurs...</span>
      </div>
      <div v-else>
        <loader></loader>
        <span class="white size-0-8em">Partie en cours, mettez un pseudo pour rejoindre...</span>
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
import PopupExit from './PopupExit.vue'
import _ from 'lodash'

const api = config.prod

export default {
  components: {
    Questions,
    InputPlayer,
    Players,
    Timer,
    Loader,
    Popup,
    PopupExit
  },
  name: 'Game',
  data () {
    return {
      time: 5,
      showModal: false,
      showModalExit: false,
      isPending: false,
      notification: false,
      notificationCss: false
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
      // On déclenche le timer à chaque fois qu'un joueur est le premier à répondre
      if (!this.isPending) {
        this.isPending = true
        axios(api + '/game/startTimer/' + this.getGame.code + '/' + this.getIdPlayer)
          .then(() => {
            this.isPending = false
          })
      }
    },
    endTimer () {
      // On soumet la réponse à l'API
      this.submitAnswer(this.$refs.questionsComponent.checked)
      // On affiche la bonne réponse
      this.$refs.questionsComponent.showGoodAnswer()
    },
    submitAnswer (question) {
      let self = this
      axios.get(api + '/game/submitAnswer/' + this.getIdPlayer + '/' + question)
        .then(response => {
          console.log(response.data)
          this.notification = response.data.message
          if (response.data.answer) {
            this.notificationCss = 'green'
          } else {
            this.notificationCss = 'red'
          }
          setTimeout(function () { self.notification = false; self.notificationCss = false }, 1500)
        })
    },
    refreshGame () {
      axios(api + '/refreshGame/' + this.getGame.code)
    },
    exitGame () {
      axios.delete(api + '/player/remove/' + this.getIdPlayer)
        .then(response => {
          window.location.replace('/')
        })
    }
  },
  computed: {
    ...mapGetters({
      getGame: 'game/getGame',
      getPlayer: 'game/getPlayer',
      getPlayers: 'game/getPlayers',
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
    },
    orderPlayers: function () {
      return _.orderBy(this.getPlayers, ['score', player => player.name.toLowerCase()], ['desc', 'asc'])
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

      let data = {fingerprint: self.getFingerprint, code: self.$route.params.code.toUpperCase()}
      self.checkIfUserAlreadyInGame(data) // On check si l'utilisateur était dans une autre partie
    })
    // Instantiate the game
    this.initGame(this.$route.params.code.toUpperCase())
  },
  mounted () {
    let self = this
    // Pusher.logToConsole = true
    let pusher = new Pusher('b1ed0160cc1033ce4f54', {
      cluster: 'eu'
    })

    let channel = pusher.subscribe(this.$route.params.code.toUpperCase())
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
        if (data.message) {
          console.log(data.message)
          this.notification = data.message
          setTimeout(function () { self.notification = false }, 1500)
        }
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
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }

  #game-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  #content-questions {
    flex-grow: 1;
  }

  .footer-icon {
    max-width: 350px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer-icon div:nth-child(1), .footer-icon div:nth-child(3){
    width: 30px;
    max-width: 50px;
  }

  .footer-icon div:nth-child(2) {
    width: 50px;
    max-width: 80px;
  }

  .footer-icon img {
    width: 100%;
  }

  .show-players {
    display: inline-block;
    margin: 0 auto;
  }

  .show-players:hover, .exit:hover {
    cursor: pointer;
  }

  #code-partage {
    line-height: 2em;
    color: white;
  }

  .code {
    font-family: 'Montserrat', sans-serif;
    color: #dd9d22;
    font-weight: 600;
    font-size: 2em;
  }

  #scoreboard {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  #scoreboard p {
    display: flex;
    justify-content: space-between;
    width: 250px;
    margin: 10px auto;
  }

  #scoreboard ul {
    margin: 0 auto;
    padding: 0;
  }

  #scoreboard li {
    text-decoration: none;
    list-style-type: none;
    color: white;
  }

  #scoreboard .scores img {
    width: 50px;
  }

  .scores {
    margin: 20px 0;
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

  #notification {
    margin: 10px auto;
    color: #dd9d22;
    font-weight: bold;
  }
</style>
