<template>
  <div class="home">
    <TaskBar />
  </div>
</template>

<script>
import TaskBar from '@/components/taskbar/taskbar'

export default {
  name: 'Home',
  components: {
    TaskBar,
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