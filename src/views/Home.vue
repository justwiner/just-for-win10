<template>
  <div class="home">
    <Desktop />
    <TaskBar />
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
</style>