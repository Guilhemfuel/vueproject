<template>
  <div id="loader"></div>
</template>

<script>
export default {
  name: 'Loader'
}
</script>

<style>
  #loader {
    border: 5px solid #00000024;
    border-radius: 50%;
    border-top: 5px solid #f3f3f3;
    width: 20px;
    height: 20px;
    -webkit-animation: spin 2s linear infinite; /* Safari */
    animation: spin 2s linear infinite;
    margin: 8px auto;
  }

  /* Safari */
  @-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
