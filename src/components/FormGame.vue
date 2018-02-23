<template>
  <div id="FormPlayer">
    <input type="text" class="input" maxlength="4" v-model="inputvalue" placeholder="CODE PARTIE">
    <SubmitForm v-on:click.native="setData(inputvalue)"/>
    <p>Le bout a été cliqué {{ counter }}</p>
    <p>{{ getData }}</p>
  </div>
</template>

<script>
import InputGame from './InputGame.vue'
import SubmitForm from './Submit.vue'
import {mapGetters, mapActions} from 'vuex'

export default {
  data () {
    return {
      counter: 0,
      inputvalue: ''
    }
  },
  components: {
    InputGame, SubmitForm
  },
  methods: {
    callcoucou () {
      console.log(this.$store.getters.getData)
    },
    ...mapActions({
      setData: 'codegame/setData'
    })
  },
  computed: {
    ...mapGetters({
      getData: 'codegame/getData'
    })
  },
  name: 'FormGame'
}
</script>

<style scoped>
</style>
