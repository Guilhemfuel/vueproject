<template>
  <div id="Timer">
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
      intervalCounter: 0,
      intervalCircle: null,
      endTimer: this.timer * 100
    }
  },
  props: {
    timer: Number
  },
  methods: {
    startTimer: function () {
      this.intervalCircle = setInterval(this.circleFunction, 10)
    },
    circleFunction: function () {
      this.timeCircle--
      if (this.timeCircle === 0) {
        this.counter--
        this.intervalCounter += 100
        this.timeCircle = 100
        if (this.intervalCounter === this.endTimer) {
          this.counterFunction()
        }
      }
    },
    counterFunction: function () {
      if (this.counter === 0) {
        this.timeCircle = 0
        clearInterval(this.intervalCircle)
        this.$emit('status', true)
      }
    }
  }
}
</script>

<style scoped>
  @import './../assets/circle.css';
</style>
