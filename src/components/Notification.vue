<template>
    <div id="Notification">
      {{ notification }}
    </div>
</template>

<script>

export default {
  name: 'Notification',
  data () {
    return {
      notification: this.message
    }
  },
  props: ['message'],
  watch: {
    notification: function () {
      let self = this
      this.notification = this.props.message
      console.log('???')
      setTimeout(function () { self.$emit('close') }, 1500)
    }
  }
}
</script>

<style scoped>
</style>
