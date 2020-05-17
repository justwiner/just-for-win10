<template>
  <div class="home">
    <Desktop />
    <TaskBar />
    <video
    v-if="false"
    autoplay
    loop
    poster
    class="bgVideo"
    width="100%"
    src="https://assets.winerlu.com/img/111.mp4"></video>
  </div>
</template>

<script>
import TaskBar from '@/components/taskbar/taskbar'
import Desktop from '@/components/desktop/index'

export default {
  name: 'Home',
  components: {
    TaskBar,
    Desktop,
  }
};
</script>

<style lang="scss">
.home {
  height: 100%;
  background-image: url('../assets/win10_bg.jpg');
  background-size: 100% 100%;
  position: relative;
}
.bgVideo {
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>