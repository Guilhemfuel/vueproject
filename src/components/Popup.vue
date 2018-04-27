<template>
  <transition name="modal">
    <div id="Popup">
      <div class="modal-shadow" @click="$emit('close')">
        <div class="modal-wrapper">
          <div class="modal-container" @click.stop>
            <div class="modal-close-button" @click="$emit('close')">×</div>
            <div class="modal-header">
              <h4>Joueurs :</h4>
            </div>
            <div class="modal-body">
              <ul>
                <li v-for="player in getPlayers" :key="player.id">
                  <p v-if="player.fingerprint === userFingerprint" class="currentUser">{{ player.name }} - {{ player.score }}</p>
                  <p v-else>{{ player.name }} - {{ player.score }}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'Popup',
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      getPlayers: 'game/getPlayers'
    })
  }
}
</script>

<style>
  .modal-shadow {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
    padding-left: 10px;
    padding-right: 10px;
  }

  .modal-container {
    max-width: 350px;
    margin: 0px auto;
    padding: 0 20px 20px 20px;
    background-color: #383838;
    color: white;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-close-button {
    color: #ababab;
    font-size: 1.6em;
    position: relative;
    height: 20px;
    top: 0;
    right: -15px;
    text-align: right;
    cursor: pointer;
  }

  .modal-header h4 {
    margin-top: 0;
    color: #717171;
  }

  .modal-body {
    margin: 20px 0;
  }

  .modal-default-button {
    float: right;
  }

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

  .modal-body ul {
    padding: 0;
  }

  .modal-body ul li {
    list-style: none;
  }
</style>
