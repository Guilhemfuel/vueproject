<template>
  <div id="Home">
    <div id="container">
      <form v-on:submit.prevent="" name="formGame">
        <input type="text" class="input" maxlength="4" v-model="inputvalue" placeholder="CODE PARTIE">
        <SubmitForm v-on:click.native="setData(inputvalue)"></SubmitForm>
      </form>
      <p>{{ getData }}</p>
      <div id="currentGame" v-if="getIfAlreadyInGame">
        Vous êtes actuellement en cours de partie :<br />
        <router-link :to="{ name: 'Game', params: { code: getIfAlreadyInGame }}">
          <button type="button">Rejoindre</button>
        </router-link>
      </div>
      <br />
      <div id="newGame">
        <form v-on:submit.prevent="" name="newGame">
          <button type="button" v-on:click="newGame">Nouvelle partie</button>
        </form>
      </div>
    </div>
    <div id="android" v-if="!isWebView">
      Téléchargez l'application Android !<br />
      <a href="http://api.quizforfun.fr/downloadApp" download="QuizForFunAndroid"><img src="./../assets/android-logo.png"/></a>
    </div>
  </div>
</template>

<script>
import SubmitForm from './Submit.vue'
import {mapGetters, mapActions} from 'vuex'
import Fingerprint2 from 'fingerprintjs2'
import axios from 'axios'
import config from '../config'

const api = config.prod

export default {
  data () {
    return {
      inputvalue: '',
      isWebView: null
    }
  },
  components: {
    SubmitForm
  },
  methods: {
    ...mapActions({
      setData: 'home/setData',
      newGame: 'home/newGame',
      checkIfUserAlreadyInGame: 'home/checkIfUserAlreadyInGame'
    })
  },
  computed: {
    ...mapGetters({
      getData: 'home/getData',
      getIfGameExist: 'home/getIfGameExist',
      getIfAlreadyInGame: 'home/getIfAlreadyInGame'
    })
  },
  watch: {
    getIfGameExist () {
      if (this.getIfGameExist) {
        this.$router.push({name: 'Game', params: {code: this.inputvalue.toUpperCase()}})
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

      self.checkIfUserAlreadyInGame(localStorage.getItem('fingerprint')) // On check si l'utilisateur était dans une autre partie
      console.log('fingerprint ' + localStorage.getItem('fingerprint'))
    })

    axios.get(api + '/iswebview')
      .then(response => {
        this.isWebView = response.data.webview
      })
  },
  name: 'Home'
}
</script>

<style scoped>
  #Home {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  #container {
    flex-grow: 0.9;
  }

  .input {
    border: none;
    border-bottom: 1px solid #383838;
    color: #383838;
    font-size: 21px;
    padding: 6px;
    text-transform: uppercase;
    background-color: transparent;
  }

  .input:focus {
    outline: none;
  }

  .input::placeholder {
    color: #383838;
  }

  button {
    color: #dd9d22;
    background-color: #383838;
    border: none;
    padding: 10px;
    cursor: pointer;
  }

  button:hover {
    color: white;
  }

  #android {
    margin: 0 auto;
    width: 100%;
    color: white;
  }

  #android img {
    margin-top: 10px;
    width: 50px;
  }
</style>
