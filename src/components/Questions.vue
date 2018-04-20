<template>
  <div id="Questions">
    <div><p id="question">{{ getQuestions[getGame['currentQuestion']]['question'] }}</p></div>
    <div>
      <form v-on:submit.prevent="" v-on:change="userHasAnswered()" name="formQuestion">
        <div v-for="answers in getQuestions[getGame['currentQuestion']]['answers']" :key="answers.id">
          <input :id="'answer_' + answers.id" type="radio" name="answers" class="input" :value="answers.id" v-model="checked">
          <label :for="'answer_' + answers.id">{{ answers.answer }}</label>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'Questions',
  data () {
    return {
      userFingerprint: localStorage.getItem('fingerprint'),
      checked: false
    }
  },
  methods: {
    ...mapActions({
    }),
    userHasAnswered () {
      this.$emit('status', true)
    },
    resetComponent () {
      this.checked = false
    }
  },
  computed: {
    ...mapGetters({
      getGame: 'game/getGame',
      getQuestions: 'game/getQuestions'
    })
  },
  mounted () {}
}
</script>

<style scoped>
  #question {
    color: white;
  }

  ul {
    padding: 0;
  }

  li {
    list-style: none;
  }
</style>
