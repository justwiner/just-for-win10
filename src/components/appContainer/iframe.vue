<template>
    <section
    v-drag
    @click="appClick"
    :style="`z-index: 1000;`"
    :id="app.id"
    class="app-iframe">
        <section class="app-iframe-opt">
            <section class="app-iframe-opt-left">
                {{app.name}}
            </section>
            <section class="app-iframe-opt-right">
                <i @click.stop="minus" @mousedown.stop="() => {}" title="最小化" class="fa" style="font-size: 1.5em;">－</i>
                <i @click="maxus" @mousedown.stop="() => {}" title="最大化" :class="[ifMaxus ? 'fa-clone' : 'fa-square-o']" class="fa"></i>
                <i @click.stop="close" @mousedown.stop="() => {}" title="关闭" class="fa" style="font-size: 1.5em;">×</i>
            </section>
        </section>
        <iframe
        v-if="app.url"
        referrerpolicy="no-referrer"
        frameborder='0'
        scrolling='auto'
        seamless
        :src="app.url">
            <p>Your browser does not support iframes.</p>
        </iframe>
        <section class="sizeChange-layer" v-show="sizeChangeLayer"></section>
        <section
        @mousedown.stop="() => {}"
        v-if="app.type === 'app'"
        class="app-content">
            <component
            ref="appC"
            v-bind:is="app.component"></component>
        </section>

        <!-- app应用窗口大小调整触发按钮 8个方向 -->
        <section @mousedown.stop="(e) => {sizeChangeS(e, 'top')}" class='app-frame-sizeBut sizeBut-top'></section>
        <section @mousedown.stop="(e) => {sizeChangeW(e, 'right')}" class='app-frame-sizeBut sizeBut-right'></section>
        <section @mousedown.stop="(e) => {sizeChangeS(e, 'bottom')}" class='app-frame-sizeBut sizeBut-bottom'></section>
        <section @mousedown.stop="(e) => {sizeChangeW(e, 'left')}" class='app-frame-sizeBut sizeBut-left'></section>
        <section @mousedown.stop="(e) => {sizeChangeSE(e, 'lt')}" class='app-frame-sizeBut sizeBut-top-left'></section>
        <section @mousedown.stop="(e) => {sizeChangeNE(e, 'rt')}" class='app-frame-sizeBut sizeBut-top-right'></section>
        <section @mousedown.stop="(e) => {sizeChangeNE(e, 'lb')}" class='app-frame-sizeBut sizeBut-bottom-left'></section>
        <section @mousedown.stop="(e) => {sizeChangeSE(e, 'rb')}" class='app-frame-sizeBut sizeBut-bottom-right'></section>
    </section>
</template>

<script>
import {TweenMax, Power4} from 'gsap'
import {mouseMove} from '@/lib/helper-dom'
import {mapState} from 'vuex'

export default {
    name: 'app-container-iframe',
    components: {
        Calculator: () => import('@/components/calculator/index'),
        ColorPick: () => import('@/components/colorPick/index'),
        SimpleMap: () => import('@/components/simpleMap/index'),
    },
    computed: {
        ...mapState({
            activeApp: state => state.activeApp
        })
    },
    watch: {
        activeApp: {
            deep: true,
            handler (app) {
                if (app.id === this.app.id) {
                    this.setActive()
                }
            }
        }
    },
    props: {
        app: {
            default: () => {},
            type: Object
        }
    },
    data () {
        return {
            ifMaxus: false,
            prePosition: [0, 0],
            preSize: this.app.defaultSize,
            sizeChangeLayer: false
        }
    },
    created () {
        this.bus.$on('activeAppFn', (app) => {
            if (this.app.id === app.id) {
                this.setActive()
            }
        })
    },
    mounted () {
        this.init()
    },
    methods: {
        init () {
            this.$nextTick(() => {
                let body = document.querySelector("body");
                if (this.app.defaultSize) {
                    this.$el.style.left = (document.body.offsetWidth/100) * (100 - parseInt(this.app.defaultSize[0]))/2 + 'px'
                    this.$el.style.top = ((document.body.offsetHeight - 40)/100) * (100 - parseInt(this.app.defaultSize[1]))/2 + 'px'
                    this.$el.style.width = this.app.defaultSize[0]
                    this.$el.style.height = this.app.defaultSize[1]
                    this.prePosition = [
                        parseInt(this.$el.style.left),
                        parseInt(this.$el.style.top)
                    ]
                }
                if (body.append) {
                    body.append(this.$el);
                } else {
                    body.appendChild(this.$el);
                }
                this.$el.style.display = 'none'
                this.setActive()
            })
        },
        minus () {
            this.$el.style.opacity = '1'
            TweenMax.fromTo(
                this.$el,
                .5,
                {
                    opacity: 1,
                    translateY: 0
                },
                {
                    ease: Power4.easeOut ,
                    display: 'none',
                    opacity: 0,
                    translateY: 300,
                    scale: 0.5
                }
            );
        },
        parseAnimationObj (obj) {
            const containerWidth = document.body.offsetWidth
            const containerHeight = document.body.offsetHeight - 40
            
            for (let key in obj) {
                obj[key] = this.parseNum(
                    obj[key],
                    ['left', 'width'].indexOf(key) > -1 ? containerWidth : containerHeight
                )
            }
        },
        parseNum (str = '', total) {
            if (str instanceof Number) return str
            else str = str.toString()
            if (str.indexOf('%') > -1) return (total/100) * parseInt(str)
            else return parseInt(str)
        },
        maxus () {
            this.ifMaxus = !this.ifMaxus
            let curLeft = this.$el.style.left
            let curTop = this.$el.style.top
            let animationObj = {
                left: curLeft,
                top: curTop,
            }
            this.parseAnimationObj(animationObj)
            let animationEnd = {}
            if (this.ifMaxus) {
                animationEnd = { 
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%'
                }
            } else {
                animationEnd = { 
                    left: this.prePosition[0],
                    top: this.prePosition[1],
                    width: this.preSize[0],
                    height: this.preSize[1]
                }
            }
            this.parseAnimationObj(animationEnd)
            this.$el.style.width = animationEnd.width + 'px'
            this.$el.style.height = animationEnd.height + 'px'
            TweenMax.fromTo(
                this.$el,
                .5,
                {
                    ...animationObj,
                },
                {
                    left: animationEnd.left,
                    top: animationEnd.top,
                    ease: Power4.easeOut ,
                }
            );
            if (this.$refs.appC && this.$refs.appC.sizeChange) {
                this.$refs.appC.sizeChange({
                    ...animationEnd,
                    height: animationEnd.height - 30
                })
            }
        },
        appClick () {
            this.setActive()
        },
        close () {
            const containerWidth = document.body.offsetWidth
            const containerHeight = document.body.offsetHeight - 40
            const left = this.parseNum(this.$el.style.left, containerWidth)
                        + this.parseNum(this.$el.style.width, containerWidth)/2
            const top = this.parseNum(this.$el.style.top, containerHeight) 
                        + this.parseNum(this.$el.style.height, containerHeight)/2
            TweenMax.to(this.$el, .5, {
                scale: 0,
                left,
                top,
                opacity: 0,
                ease: Power4.easeOut 
            });
            setTimeout(() => {
                this.$emit('closeApp', this.app)
            }, 600)
        },
        setActive () {
            if (this.$el.style.display === 'none') {
                this.showAppAnimate()
            }
            let appIframes = document.querySelectorAll('.app-iframe')
            let maxZIndex = 1000
            let minZIndex = appIframes[0].style.zIndex ? +appIframes[0].style.zIndex : 1000
            for (let app of appIframes) {
                let zIndex = app.style.zIndex
                if (!zIndex) continue
                if (maxZIndex < +zIndex) {
                    maxZIndex = +zIndex
                }
                if (minZIndex > +zIndex) {
                    minZIndex = +zIndex
                }
            }
            this.$el.style.zIndex = maxZIndex + 1
            if (minZIndex > 1000) {
                const diff = minZIndex - 1000
                for (let app of appIframes) {
                    app.style.zIndex = +app.style.zIndex - diff
                }
            }
            this.$store.commit('updateActiveApp', this.app)
        },
        showAppAnimate () {
            this.$el.style.display = 'block'
            this.$el.style.opacity = '0'
            TweenMax.fromTo(
                this.$el,
                .5,
                {
                    display: 'none',
                    opacity: 0,
                    translateY: 300,
                    scale: 0.5
                },
                {
                    ease: Power4.easeOut ,
                    display: 'block',
                    opacity: 1,
                    translateY: 0,
                    scale: 1
                }
            );
        },
        /**
         * app 窗口大小变化
         */
        /**
         * 上下
         */
        sizeChangeS(e, type) {
            const disY = this.$el.offsetTop;
            const sourceHeight = this.$el.offsetHeight;
            this.layerHelper(true)
            mouseMove((e) => {
                const changeHeight = disY - e.clientY;
                let top = this.parseNum(this.$el.style.top, document.body.offsetHeight - 40)
                let height = sourceHeight
                if (type === 'top') {
                    top = e.clientY
                    height = sourceHeight + changeHeight
                } else if (type === 'bottom') {
                    height = -changeHeight
                }
                if (height < 200) return
                if (top < 0) top = 0
                this.$el.style.top = top + 'px'
                this.$el.style.height = height + 'px'
                this.prePosition = [this.prePosition[0], top]
                this.preSize = [this.preSize[0], height]
            }, () => {
                this.layerHelper(false)
                this.sizeChange()
            })
        },
        /**
         * 左右
         */
        sizeChangeW(e, type) {
            const disX = this.$el.offsetLeft;
            const sourceWidth = this.$el.offsetWidth;
            this.layerHelper(true)
            mouseMove((e) => {
                const changeWidth = disX - e.clientX;
                let left = this.parseNum(this.$el.style.left, document.body.offsetWidth)
                let width = sourceWidth
                if (type === 'left') {
                    left = e.clientX
                    width = sourceWidth + changeWidth
                } else if (type === 'right') {
                    width = -changeWidth
                }
                if (width < 200) return
                this.$el.style.left = left + 'px'
                this.$el.style.width = width + 'px'
                this.prePosition = [left, this.prePosition[1]]
                this.preSize = [width, this.preSize[1]]
            }, () => {
                this.layerHelper(false)
                this.sizeChange()
            })
        },
        /**
         * 
         * 顺时针45°
         */
        sizeChangeNE(e, type) {
            const disX = this.$el.offsetLeft;
            const disY = this.$el.offsetTop;
            const sourceWidth = this.$el.offsetWidth;
            const sourceHeight = this.$el.offsetHeight;
            this.layerHelper(true)
            mouseMove((e) => {
                const changeWidth = disX - e.clientX;
                const changeHeight = disY - e.clientY;
                let left = this.parseNum(this.$el.style.left, document.body.offsetWidth)
                let width = sourceWidth
                let top = this.parseNum(this.$el.style.top, document.body.offsetHeight - 40)
                let height = sourceHeight
                if (type === 'rt') {
                    height = sourceHeight + changeHeight
                    width = -changeWidth
                    top = e.clientY
                } else if (type === 'lb') {
                    height = -changeHeight
                    width = sourceWidth + changeWidth
                    left = e.clientX
                }
                if (width <= 200) width = 200
                if (height <= 200) height = 200
                if (width > 200) {
                    this.$el.style.left = left + 'px'
                    this.prePosition = [left, this.prePosition[1]]
                }
                if (top < 0) top = 0
                if (height > 200) {
                    this.$el.style.top = top + 'px'
                    this.prePosition = [this.prePosition[0], top]
                }
                this.$el.style.width = width + 'px'
                this.$el.style.height = height + 'px'
                this.preSize = [width, height]
            }, () => {
                this.layerHelper(false)
                this.sizeChange()
            })
        },
        /**
         * 逆时针45°
         */
        sizeChangeSE(e, type) {
            const disX = this.$el.offsetLeft;
            const disY = this.$el.offsetTop;
            const sourceWidth = this.$el.offsetWidth;
            const sourceHeight = this.$el.offsetHeight;
            this.layerHelper(true)
            mouseMove((e) => {
                const changeWidth = disX - e.clientX;
                const changeHeight = disY - e.clientY;
                let left = this.parseNum(this.$el.style.left, document.body.offsetWidth)
                let width = sourceWidth
                let top = this.parseNum(this.$el.style.top, document.body.offsetHeight - 40)
                let height = sourceHeight
                if (type === 'lt') {
                    height = sourceHeight + changeHeight
                    width = sourceWidth + changeWidth
                    top = e.clientY
                    left = e.clientX
                } else if (type === 'rb') {
                    height = -changeHeight
                    width = -changeWidth
                }
                if (width <= 200) width = 200
                if (height <= 200) height = 200
                if (width > 200) {
                    this.$el.style.left = left + 'px'
                    this.prePosition = [left, this.prePosition[1]]
                }
                if (top < 0) top = 0
                if (height > 200) {
                    this.$el.style.top = top + 'px'
                    this.prePosition = [this.prePosition[0], top]
                }
                this.$el.style.width = width + 'px'
                this.$el.style.height = height + 'px'
                this.preSize = [width, height]
            }, () => {
                this.layerHelper(false)
                this.sizeChange()
            })
        },
        sizeChange () {
            const docWidth = document.body.offsetWidth
            const docHeight = document.body.offsetHeight
            if (this.$refs.appC && this.$refs.appC.sizeChange) {
                this.$refs.appC.sizeChange({
                    width: this.parseNum(this.$el.style.width, docWidth),
                    height: this.parseNum(this.$el.style.height, docHeight) - 30,
                    left: this.parseNum(this.$el.style.left, docWidth),
                    top: this.parseNum(this.$el.style.top, docHeight),
                })
            }
        },
        /**
         * app 窗口尺寸位置变化时
         * 防止app内部内容捕获到mousemove事件
         * 增加模态框
         */
        layerHelper (flag) {
            this.sizeChangeLayer = flag
        }
    }
}
</script>

<style lang="scss">
$sizeButWidth: 10px;
$menuBarHeight: 30px;
.app-iframe {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    height: 50%;
    width: 50%;
    box-shadow: 0 0 5px #000000;
    background: rgba($color: #ffffff, $alpha: .6);
    overflow: hidden;
    transition: height 0s,
                width 0s,
                border .3s,
                color .3s;
    &-opt {
        width: 100%;
        height: $menuBarHeight;
        background-color: #ffffff;
        color: black;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 10px;
        cursor: pointer;
        &-left {
            font-size: .9rem;
        }
        &-right {
            width: 150px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: 100%;
            i {
                cursor: pointer;
                line-height: 100%;
                transition: background-color .3s, color 0s;
                width: 33%;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                &:hover {
                    background-color: rgba(230, 230, 230, 1);
                }
            }
            .fa-close:hover {
                background-color: red;
                color: white;
            }
        }
    }
    iframe {
        width: 100%;
        height: calc(100% - 30px);
    }
}
.app-maxus {
    height: calc(100% - 40px);
    width: 100%;
}
.app-frame-sizeBut {
    position: absolute;
    opacity: 0;
}
.sizeBut-top {
    top: 0;
    left: $sizeButWidth;
    width: calc(100% - #{$sizeButWidth} * 2);
    height: 2px;
    cursor: s-resize;
}
.sizeBut-right {
    right: 0;
    top: $sizeButWidth;
    width: 2px;
    height: calc(100% - #{$sizeButWidth} * 2);
    cursor: w-resize;
}
.sizeBut-bottom {
    bottom: 0;
    left: $sizeButWidth;
    width: calc(100% - #{$sizeButWidth} * 2);
    height: 2px;
    cursor: s-resize;
}
.sizeBut-left {
    top: $sizeButWidth;
    left: 0;
    width: 2px;
    height: calc(100% - #{$sizeButWidth} * 2);
    cursor: w-resize;
}
.sizeBut-top-left {
    top: 0;
    left: 0;
    width: $sizeButWidth;
    height: $sizeButWidth;
    cursor: se-resize;
}
.sizeBut-top-right {
    top: 0;
    right: 0;
    width: $sizeButWidth;
    height: $sizeButWidth;
    cursor: ne-resize;
}
.sizeBut-bottom-left {
    bottom: 0;
    left: 0;
    width: $sizeButWidth;
    height: $sizeButWidth;
    cursor: ne-resize;
}
.sizeBut-bottom-right {
    bottom: 0;
    right: 0;
    width: $sizeButWidth;
    height: $sizeButWidth;
    cursor: se-resize;
}
.app-content {
    width: 100%;
    height: calc(100% - 30px);
}
.sizeChange-layer {
    position: absolute;
    top: $menuBarHeight;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
}
</style>