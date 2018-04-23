<template>
  <div id="Players">
    <h4>Joueurs :</h4>
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
  #Players {
    width: 200px;
    margin-left: auto;
    margin-right: auto;
    text-align: left;
    flex-grow: 1;
  }

  h4 {
    color: #383838;
    text-align: center;
  }

  ul {
    padding: 0;
    line-height: 0.8em;
  }

  li {
    list-style: none;
  }

  .currentUser {
    color: #cccccc;
  }
</style>
