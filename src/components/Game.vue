<template>
  <div id="Game" v-if="getGame !== ''">
    <transition name="fade">
      <div id="Player" v-if="getPlayer === false">
        <input-player></input-player>
      </div>
    </transition>
    <p v-if="getOwner === true">
      Partagez ce code : {{ getGame.code }} !
      <br />
      <br />
      <button type="button" v-on:click="startGame" v-bind:class="{ active: readyToStart }" v-bind:disabled="!readyToStart">Lancer la partie !</button>
    </p>
    <players></players>
  </div>
  <div class="errorMessage" v-else>
    {{ getErrorMessage }}
  </div>
</template>

<script>
import InputPlayer from './InputPlayer.vue'
import Players from './Players.vue'
import {mapGetters, mapActions} from 'vuex'
import Fingerprint2 from 'fingerprintjs2'
import Pusher from 'pusher-js'

export default {
  components: {
    InputPlayer, Players
  },
  name: 'Game',
  methods: {
    ...mapActions({
      initGame: 'game/initGame',
      setGame: 'game/setGame',
      setFingerprint: 'game/setFingerprint',
      checkIfUserAlreadyInGame: 'game/checkIfUserAlreadyInGame'
    }),
    startGame: function () {
      console.log('Start the game')
    }
  },
  computed: {
    ...mapGetters({
      getGame: 'game/getGame',
      getPlayer: 'game/getPlayer',
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
