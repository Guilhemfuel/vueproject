<template>
    <input type="text" class="input" maxlength="4" v-model="message" placeholder="CODE PARTIE">
</template>

<script>
export default {
  data () {
    return {
      message: ''
    }
  },
  watch: {
    message: function (val) {
      console.log(val.toUpperCase())
      this.message = val.toUpperCase()
    }
  }
}
</script>

<style scoped>
    .input {
        border: none;
        border-bottom: 1px solid #383838;
        background-color: #42a2ff;
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
