<template>
  <div id="Game">
    <input-player></input-player>
    <players></players>
  </div>
</template>

<script>
import InputPlayer from './InputPlayer.vue'
import Players from './Players.vue'
import {mapGetters, mapActions} from 'vuex'

export default {
  components: {
    InputPlayer, Players
  },
  name: 'Game',
  methods: {
    ...mapActions({
      setGame: 'game/setGame'
    })
  },
  computed: {
    ...mapGetters({
      getGame: 'game/getGame'
    })
  },
  mounted () {
    // Instantiate the game
    this.setGame(this.$route.params.code)
  }
}
</script>

<style scoped>
</style>
