<template>
  <div id="Game" v-if="getGame !== ''">
    <input-player></input-player>
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
    })
  },
  computed: {
    ...mapGetters({
      getGame: 'game/getGame',
      getErrorMessage: 'game/getErrorMessage',
      getFingerprint: 'game/getFingerprint'
    })
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
    console.log(this.getGame)
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
      console.log('pusher' + obj)
    })
  }
}
</script>

<style scoped>
</style>
