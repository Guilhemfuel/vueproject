<template>
  <div id="InputPlayer">
    <div>
      <form v-on:submit.prevent="">
        <input type="text" class="input" maxlength="15" v-model="pseudo" placeholder="VOTRE PSEUDO">
        <SubmitForm v-on:click.native="addPlayer(pseudo)"></SubmitForm>
      </form>
    </div>
    <div class="errorMessage">
      {{ getErrorMessage }}
    </div>
  </div>
</template>

<script>
import SubmitForm from './Submit.vue'
import {mapGetters, mapActions} from 'vuex'

export default {
  components: {
    SubmitForm
  },
  name: 'InputPlayer',
  data () {
    return {
      pseudo: ''
    }
  },
  watch: {
    message: function (val) {
      this.message = val.toUpperCase()
    }
  },
  methods: {
    ...mapActions({
      addPlayer: 'game/addPlayer'
    })
  },
  computed: {
    ...mapGetters({
      getErrorMessage: 'game/getErrorMessage'
    })
  }
}
</script>

<style scoped>
  .input {
    border: none;
    border-bottom: 1px solid #383838;
    color: #383838;
    font-size: 21px;
    padding: 6px;
    background-color: transparent;
  }

  .input:focus {
    outline: none;
  }

  .input::placeholder {
    color: #383838;
  }

  .errorMessage {
    color: #b31c09;
    padding: 5px;
  }
</style>
