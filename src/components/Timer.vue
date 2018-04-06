<template>
  <div id="Timer">
    <div v-on:click="calculateTimer">CLick</div>
    <div class="c100" v-bind:class="'p' + timeCircle">
      <span id="time">{{ counter }}</span>
      <div class="slice">
        <div class="bar"></div>
        <div class="fill"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Timer',
  data () {
    return {
      counter: this.timer,
      timeCircle: 100,
      intervalCounter: null,
      intervalCircle: null
    }
  },
  props: {
    timer: Number
  },
  methods: {
    calculateTimer: function () {
      this.intervalCounter = setInterval(this.counterFunction, 1000)
      this.intervalCircle = setInterval(this.circleFunction, 10)
    },
    circleFunction: function () {
      this.timeCircle--
      if (this.timeCircle === 0) {
        this.timeCircle = 100
      }
    },
    counterFunction: function () {
      this.counter--
      if (this.counter === 0) {
        clearInterval(this.intervalCounter)
        clearInterval(this.intervalCircle)
        console.log('Compteur terminé')
      }
    }
  }
}
</script>

<style scoped>
  @import './../assets/circle.css';
</style>
