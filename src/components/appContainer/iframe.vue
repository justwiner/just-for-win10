<template>
    <section
    v-drag
    @click="appClick"
    style="z-index: 1000"
    class="app-iframe">
        <section class="app-iframe-opt">
            <section class="app-iframe-opt-left">
                {{app.name}}
            </section>
            <section class="app-iframe-opt-right">
                <i @click="minus" title="最小化" class="fa fa-window-minimize"></i>
                <i @click="maxus" title="最大化" :class="[ifMaxus ? 'fa-window-restore' : 'fa-window-maximize']" class="fa"></i>
                <i @click="close" title="关闭" class="fa fa-window-close"></i>
            </section>
        </section>
        <iframe
        v-if="app.url"
        allow='*'
        referrerpolicy="no-referrer"
        frameborder='0'
        scrolling='auto'
        seamless
        :src="app.url">
            <p>Your browser does not support iframes.</p>
        </iframe>
    </section>
</template>

<script>
export default {
    name: 'app-container-iframe',
    directives: {
        drag: {
            // 指令的定义
            bind: function (el, binding, vnode) {
                let oDiv = el;   //获取当前元素
                oDiv.onmousedown = (e) => {
                    //算出鼠标相对元素的位置
                    let disX = e.clientX - oDiv.offsetLeft;
                    let disY = e.clientY - oDiv.offsetTop;
                    document.onmousemove = (e)=>{
                        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                        let left = e.clientX - disX;    
                        let top = e.clientY - disY;
                
                        //移动当前元素
                        oDiv.style.left = left + 'px';
                        oDiv.style.top = top + 'px';
                        vnode.context.prePosition = [left, top]
                    };
                    document.onmouseup = (e) => {
                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                };
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
            prePosition: [0, 0]
        }
    },
    mounted () {
        this.init()
    },
    methods: {
        init () {
            this.$nextTick(() => {
                const body = document.querySelector("body");
                if (body.append) {
                    body.append(this.$el);
                } else {
                    body.appendChild(this.$el);
                }
                this.setActive()
            })
        },
        minus () {
            this.$el.className = 'app-iframe app-hidden'
        },
        maxus () {
            this.ifMaxus = !this.ifMaxus
            if (this.ifMaxus) {
                this.$el.className = 'app-iframe app-maxus'
                this.$el.style.left = '0'
                this.$el.style.top = '0'
            } else {
                this.$el.className = 'app-iframe'
                this.$el.style.left = this.prePosition[0] + 'px'
                this.$el.style.top = this.prePosition[1] + 'px'
            }
        },
        appClick () {
            this.setActive()
        },
        close () {

        },
        setActive () {
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
        }
    }
}
</script>

<style lang="scss">
.app-iframe {
    position: absolute;
    top: 25%;
    left: 25%;
    bottom: 0;
    right: 0;
    height: 50%;
    width: 50%;
    box-shadow: 0 0 5px #000000;
    transition: height .3s,
                width .3s,
                border .3s,
                color .3s;
    &-opt {
        width: 100%;
        height: 30px;
        background-image: linear-gradient(45deg, #0081ff, #1cbbb4);
        color: #ffffff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        cursor: pointer;
        &-left {
            font-size: .9rem;
        }
        &-right {
            width: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            i {
                cursor: pointer;
                color: lightgrey;
                &:hover {
                    color: white;
                }
            }
        }
    }
    iframe {
        width: 100%;
        height: calc(100% - 30px);
    }
}
.app-hidden {
    display: none;
}
.app-maxus {
    height: calc(100% - 40px);
    width: 100%;
}
</style>