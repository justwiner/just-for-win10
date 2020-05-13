<template>
    <div @mousedown="click" ref="justButton" class="rkmd-btn ripple-effect">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'just-button',
    data () {
        return {
            timeout: null,
            wait: 600
        }
    },
    methods: {
        click (e) {
            this.startAnimate(e)
        },
        startAnimate (e) {
            let self = this.$refs.justButton

            // Disable right click
            if(e.button === 2) {
                return false;
            }
            let ripple = self.querySelector('.ripple');
            if(!ripple) {
                ripple = document.createElement('span')
                ripple.className = 'ripple'
                self.prepend(ripple);
            }
            this.removeClass(ripple, 'animated')
            const eWidth = self.offsetWidth;
            const eHeight = self.offsetHeight;
            const size = Math.max(eWidth, eHeight);
            ripple.style.width = size +'px'
            ripple.style.height = size +'px'
            ripple.style.top = '-50%'
            ripple.style.left = '0'
            this.addClass(ripple, 'animated')
            setTimeout(function() {
                if (self.contains(ripple)) {
                    self.removeChild(ripple)
                }
            }, 600);
        },
        removeClass (el, className) {
            let classList = Array.from(el.classList)
            const index = classList.findIndex(item => item === className)
            if (index > -1) {
                classList.splice(index, 1)
                el.className = classList.join(' ')
            }
        },
        addClass (el, className) {
            let classList = Array.from(el.classList)
            classList.push(className)
            el.className = classList.join(' ')
        }
    }
}
</script>

<style lang='scss'>
.rkmd-btn {
  display: inline-block;
  position: relative;
  cursor: pointer;
  height: 100%;
  outline: none;
  border: none;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
  border-radius: 2px;
  -webkit-transition: all .3s ease-out;
  transition: all .3s ease-out;
}
.ripple-effect {
  display: inline-block;
  position: relative;
  overflow: hidden;
  vertical-align: middle;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
  z-index: 1;
}
.ripple-effect .ripple {
  display: block;
  position: absolute;
  border-radius: 100%;
  background: rgba(121, 111, 111, 0.5);
  -webkit-transform: scale(0);
          transform: scale(0);
  pointer-events: none;
}
.ripple-effect .animated {
  -webkit-animation: ripple 0.5s linear;
          animation: ripple 0.5s linear;
}
@-webkit-keyframes ripple {
  100% {
    opacity: 0;
    -webkit-transform: scale(2.5);
            transform: scale(2.5);
  }
}
@keyframes ripple {
  100% {
    opacity: 0;
    -webkit-transform: scale(2.5);
            transform: scale(2.5);
  }
}
</style>