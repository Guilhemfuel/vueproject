<template>
  <div id="InputPlayer">
    <input type="text" class="input" maxlength="15" v-model="pseudo" placeholder="VOTRE PSEUDO">
    <SubmitForm v-on:click.native="addPlayer(pseudo)"></SubmitForm>
  </div>
</template>

<script>
import SubmitForm from './Submit.vue'
import {mapActions} from 'vuex'

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
      console.log(val.toUpperCase())
      this.message = val.toUpperCase()
    }
  },
  methods: {
    ...mapActions({
      addPlayer: 'game/addPlayer'
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
  }

  .input:focus {
    outline: none;
  }

  .input::placeholder {
    color: #383838;
  }
</style>
