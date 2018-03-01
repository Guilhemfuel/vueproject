<template>
  <div id="FormGame">
    <input type="text" class="input" maxlength="4" v-model="inputvalue" placeholder="CODE PARTIE">
    <SubmitForm v-on:click.native="setData(inputvalue)"></SubmitForm>
    <p>{{ getData }}</p>
  </div>
</template>

<script>
import SubmitForm from './Submit.vue'
import {mapGetters, mapActions} from 'vuex'

export default {
  data () {
    return {
      inputvalue: ''
    }
  },
  components: {
    SubmitForm
  },
  methods: {
    test () {
      console.log(this.$store.getters.getData)
      this.$router.push('Player')
    },
    ...mapActions({
      setData: 'codegame/setData'
    })
  },
  computed: {
    ...mapGetters({
      getData: 'codegame/getData',
      getIfGameExist: 'codegame/getIfGameExist'
    })
  },
  watch: {
    inputvalue: function (value) {
      this.inputvalue = value.toUpperCase()
    },
    getIfGameExist () {
      if (this.getIfGameExist) {
        this.$router.push({name: 'Game', params: {code: this.inputvalue}})
      }
    }
  },
  name: 'FormGame'
}
</script>

<style scoped>
  .input {
    border: none;
    border-bottom: 1px solid #383838;
    color: #383838;
    font-size: 21px;
    padding: 6px;
    text-transform: uppercase;
  }

  .input:focus {
    outline: none;
  }

  .input::placeholder {
    color: #383838;
  }
</style>
