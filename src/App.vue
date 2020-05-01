<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import moment from 'moment'
let intervalId = null

export default {
  name: 'app',
  created () {
    this.$store.commit('updateTime', moment().format('YYYY-MM-DD HH:mm:ss'))
    intervalId = setInterval(() => {
      this.$store.commit('updateTime', moment().format('YYYY-MM-DD HH:mm:ss'))
    }, 500)
  },
  beforeDestroy () {
    intervalId && clearInterval(intervalId)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  width: 100%;
  height: 100%;
  color: #2c3e50;
}
</style>
