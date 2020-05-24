<template>
  <div class="home">
    <Desktop />
    <TaskBar />
    <section class="bgCool" ref="bgCool">
      <img src="../assets/coolbg/2.jpg" id="bgCool" >
      <canvas :width="clientWidth" :height="clientHeight"></canvas>
    </section>
    <just-load />
  </div>
</template>

<script>
import TaskBar from '@/components/taskbar/taskbar'
import Desktop from '@/components/desktop/index'
import cloudsImg from '@/assets/coolbg/clouds.jpg'
import {iflogin, ifPC} from '@/lib/tools'

export default {
  name: 'Home',
  components: {
    TaskBar,
    Desktop,
  },
  created () {
    if (!ifPC()) {
        this.$router.push({
          name: 'notPC'
        })
        return
      }
    if (!iflogin()) {
      this.$router.push({
        name: 'Login'
      })
    }
  },
  mounted () {
    this.initCoolBg()
  },
  computed: {
    clientWidth () {
      return document.body.clientWidth
    },
    clientHeight () {
      return document.body.clientHeight
    }
  },
  methods: {
    initCoolBg () {
      let spriteImages 	= document.querySelectorAll( '#bgCool' );
			let spriteImagesSrc = [];

			for ( let i = 0; i < spriteImages.length; i++ ) {
				let img = spriteImages[i];
				spriteImagesSrc.push( img.getAttribute('src' ) );
			}

			let initCanvasSlideshow = new CanvasSlideshow({
				sprites: spriteImagesSrc,
				displacementImage: cloudsImg,
				autoPlay: true,
				autoPlaySpeed: [10, 3],
        displaceScale: [200, 70],
        $el: this.$refs.bgCool
			});
    }
  }
};
</script>

<style lang="scss">
.home {
  height: 100%;
  // background-image: url('../assets/win10_bg.jpg');
  background-size: 100% 100%;
  position: relative;
}
.bgCool {
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  canvas {
    touch-action: none;
    object-fit: cover;
    width: 100%;
    height: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1.2);
    cursor: inherit;
    position: absolute;
  }
}
</style>