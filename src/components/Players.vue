<template>
  <div id="Players">
    <ul>
      <li v-for="player in getPlayers" :key="player.id">
        {{ player.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'Players',
  data () {
    return {}
  },
  methods: {
    ...mapActions({
      setPlayers: 'game/setPlayers'
    })
  },
  computed: {
    ...mapGetters({
      getPlayers: 'game/getPlayers'
    })
  },
  mounted () {
    console.log('Players monté')
  }
}
</script>

<style scoped>
  li {
    list-style: none;
  }
</style>
