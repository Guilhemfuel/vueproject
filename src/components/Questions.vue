<template>
  <div id="Questions">
    <div><p id="question">{{ getGame['currentQuestion'] + 1 }} - {{ getQuestions[getGame['currentQuestion']]['question'] }}</p></div>
    <div>
      <form v-on:submit.prevent="" v-on:change="userHasAnswered()" name="formQuestion">
        <div v-for="answers in getQuestions[getGame['currentQuestion']]['answers']" :key="answers.id">
          <input :id="'answer_' + answers.id" type="radio" name="answers" class="input" :value="answers.id" v-model="checked" :disabled="disabled === true">
          <label :for="'answer_' + answers.id" v-bind:class="[{'correct' : (goodAnswer === answers.id)}, {'wrong' : (wrongAnswer === answers.id)}]">{{ answers.answer }}</label>
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
      checked: false,
      goodAnswer: false,
      wrongAnswer: false,
      disabled: false
    }
  },
  methods: {
    ...mapActions({
    }),
    userHasAnswered () {
      this.$emit('status', true)
    },
    showGoodAnswer () {
      let self = this
      this.disabled = true
      this.getQuestions[this.getGame['currentQuestion']]['answers'].forEach(function (element) {
        if (element.goodAnswer) {
          self.goodAnswer = element.id
          if (self.checked && self.checked !== element.id) {
            self.wrongAnswer = self.checked
          }
        }
      })
    },
    resetComponent () {
      this.checked = false
      this.goodAnswer = false
      this.wrongAnswer = false
      this.disabled = false
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
  #Questions {
    max-width: 350px;
    margin: auto;
  }

  form label {
    display: block;
    background-color: white;
    border-radius: 10px;
    padding: 5px;
    box-sizing: border-box;
    margin-bottom: 20px;
    color: #1d77a6;
    font-weight: bold;
  }

  form label:hover {
    cursor: pointer;
  }

  input {
    display: none;
  }

  :checked + label {
    background-color: #dd9d22;
    color: white;
  }

  #question {
    color: white;
    font-weight: bold;
  }

  .wrong {
    color: white;
    background-color: #7d1b1b!important;
  }

  .correct {
    color: white;
    background-color: #26ad71!important;
  }

  ul {
    padding: 0;
  }

  li {
    list-style: none;
  }
</style>
