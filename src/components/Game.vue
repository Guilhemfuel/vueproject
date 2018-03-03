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
import globalMethods from './../functions/functions'

export default {
  components: {
    InputPlayer, Players
  },
  name: 'Game',
  methods: {
    ...mapActions({
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
    // Créer un cookie fingerprint si il n'existe pas
    new Fingerprint2().get(function (result, components) {
      let verif = globalMethods.checkCookie('quizforfun', result) // On crée un cookie avec le fingerprint si il n'y en a pas

      if (!verif) {
        self.setFingerprint(result) // On set le nouveau fingerprint
        console.log('aucun cookie')
      } else {
        self.setFingerprint(globalMethods.getCookie('quizforfun')) // On remet la valeur du cookie en fingerprint
      }

      let data = {fingerprint: self.getFingerprint, code: self.$route.params.code}
      self.checkIfUserAlreadyInGame(data) // On check si l'utilisateur était dans une autre partie
    })
    // Instantiate the game
    this.setGame(this.$route.params.code)
    console.log(this.getGame)
  },
  mounted () {
  }
}
</script>

<style scoped>
</style>
