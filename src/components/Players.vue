<template>
  <div id="Players">
    <ul>
      <li v-for="player in getPlayers" :key="player.id">
        <p v-if="player.fingerprint === userFingerprint" class="currentUser">{{ player.name }}</p>
        <p v-else>{{ player.name }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'Players',
  data () {
    return {
      userFingerprint: localStorage.getItem('fingerprint')
    }
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
  mounted () {}
}
</script>

<style scoped>
  ul {
    padding: 0;
  }

  li {
    list-style: none;
  }

  .currentUser {
    color: #42a2ff;
  }
</style>
