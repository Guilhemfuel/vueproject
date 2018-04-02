<template>
  <div id="Questions">
    <div><p>{{ getQuestions[getGame['currentQuestion']]['question'] }}</p></div>
    <div>
      <form v-on:submit.prevent="" name="formQuestion">
        <div v-for="answers in getQuestions[getGame['currentQuestion']]['answers']" :key="answers.id">
          <input :id="'answer_' + answers.id" type="radio" name="answers" class="input" :value="answers.id">
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
      userFingerprint: localStorage.getItem('fingerprint')
    }
  },
  methods: {
    ...mapActions({
    })
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
  ul {
    padding: 0;
  }

  li {
    list-style: none;
  }
</style>
