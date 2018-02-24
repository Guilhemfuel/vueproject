<template>
  <div id="FormPlayer">
    <InputPlayer/>
    <SubmitForm/>
  </div>
</template>

<script>
import InputPlayer from './InputPlayer.vue'
import SubmitForm from './Submit.vue'

export default {
  components: {
    InputPlayer, SubmitForm
  },
  name: 'Game'
}
</script>

<style scoped>
</style>
