<template>
    <section class="animates" ref="animatesContent">
        <section class="animates-layer"></section>
        <section
        class="animates-title"
        v-show="status <= 2"
        id="animates-title">
            {{title}}
        </section>
        <section class="animates-load" v-if="status === 2">
            <section class="animates-load-icon"></section>
            <section class="animates-load-icon"></section>
            <section class="animates-load-icon"></section>
        </section>
        <section class="animates-cast" v-if="status === 3">
            <cast class="castObj" ref='cast'/>
            <img
            class="cloud-bg"
            src="../../assets/cast/cloud-bg.png"
            style="transform: matrix3d(0.997564, -0.0697565, 0, 0, 0.0697565, 0.997564, 0, 0, 0, 0, 1, 0, 1633.44, 46.8167, 0, 1);">
            <img
            class="cloud-bg2"
            src="../../assets/cast/cloud-bg.png"
            style="transform: matrix3d(0.990268, 0.139173, 0, 0, -0.139173, 0.990268, 0, 0, 0, 0, 1, 0, 673.44, 27.4936, 0, 1);">
            <img
            class="land-bg land-bg-1"
            src="../../assets/cast/foreground.png">
            <img
            class="cast-bg"
            src="../../assets/cast/background.jpg">
            <section class="cast-title" id="cast-title">
                哈尔的移动城堡
            </section>
        </section>
        <section v-if="status === 4" ref="25DContainer" class="animates-25D">
            <IMG25D
            ref="img25D"
            :url='demo25D'
            :spriteUrl='demo25DSprite'/>
        </section>
    </section>
</template>

<script>
import {TweenMax, Back, TimelineMax, TweenLite, Linear, Power0, Power4} from 'gsap'
import cast from './cast'
import IMG25D from './2.5DImg'
import demo25D from '@/assets/2.5D/photo.jpg'
import demo25DSprite from '@/assets/2.5D/sprite.jpg'
export default {
    name: 'animates',
    components: {
        cast,
        IMG25D
    },
    computed: {
        demo25D () {
            return demo25D
        },
        demo25DSprite () {
            return demo25DSprite
        }
    },
    data () {
        return {
            title: '即将进入动画，您不需要进行多余操作，敬请观看~',
            status: 0
        }
    },
    mounted () {
        setTimeout(() => {
            this.init()
        }, 200)
    },
    methods: {
        init () {
            const mySplitText = new SplitText("#animates-title", {type:"chars"});
            const chars = mySplitText.chars;
            this.status = 1
            this.$nextTick(() => {
                const t = new TimelineMax()
                t.set('#animates-title', {
                    display: 'block'
                })
                t.staggerFrom(chars, 0.8, {opacity:0, scale:0, y:80, rotationX:180, transformOrigin:"0% 50% -50", ease:Back.easeOut}, 0.1);
                t.fromTo(
                    '#animates-title',
                    1,
                    {y: '0', scale: '1'},
                    {
                        y: '-300%',
                        scale: '0.8',
                        onComplete: () => {
                            this.createNum()
                        }
                    },
                );
            })
        },
        createNum () {
            this.status = 2
            this.$nextTick(() => {
                const t = new TimelineMax()
                t.staggerTo('.animates-load-icon',0.5, {opacity: 0.7, scale: '1.2'}, 0.5)
                t.staggerTo('.animates-load-icon',0.5, {opacity: 1, scale: '1'}, 0.5)
                t.repeat(-1)
                setTimeout(() => {
                    t.kill()
                    this.renderLoading(this.renderHaer)
                }, 2000)
            })
        },
        renderHaer () {
            this.status = 3
            this.$nextTick(() => {
                this.castMove()
                this.$refs.cast.init()
                this.$refs.cast.run()
                this.renderCloud()
            })
        },
        castMove () {
            const move = TweenMax.fromTo('.castObj', 20, {
                x: '200%',
            }, {
                x: '-200%',
                ease: Power0.easeIn
            }).repeat(-1)
            setTimeout(() => {
                this.$refs.cast.stopRun()
                move.pause()
                this.renderTitle(move)
                setTimeout(() => {
                    this.render25DDemo()
                }, 5000)
            }, 8000)
        },
        renderCloud () {
            TweenMax.to('.cloud-bg', 40, {
                x: this.$refs.cast.WIDTH * 2,
                y: 200 * this.$refs.cast.scale,
                ease: Linear.easeNone,
                repeat: -1,
                force3D: true,
                onRepeat: function () {
                    TweenLite.set('.cloud-bg', {
                        y: Math.random() * 200 - 100,
                        rotationZ: Math.round(Math.random() * 60) - 30,
                        scaleX: Math.random() > 0.5 ? 1 : -1
                    });
                }
            });

            TweenMax.to('.cloud-bg2', 40, {
                x: this.$refs.cast.WIDTH * 2,
                y: 200 * this.$refs.cast.scale,
                ease: Linear.easeNone,
                delay: 10,
                repeat: -1,
                force3D: true,
                onRepeat: function () {
                    TweenLite.set('.cloud-bg2', {
                        y: Math.random() * 200 - 100,
                        rotationZ: Math.round(Math.random() * 60) - 30,
                        scaleX: Math.random() > 0.5 ? 1 : -1
                    });
                }
            });
        },
        renderTitle (move) {
            const mySplitText = new SplitText("#cast-title", {type:"chars"});
            const chars = mySplitText.chars;
            this.$nextTick(() => {
                const t = new TimelineMax()
                t.set(
                    '#cast-title',
                    {
                        display: 'block'
                    }
                )
                t.staggerFrom(chars, 1.5, {y:80, ease:Back.easeOut}, 0.1);
                t.fromTo(
                    '#cast-title',
                    1,
                    {
                        scale: '1',
                    },
                    {
                        scale: '1',
                        onComplete: () => {
                            move.play()
                            this.$refs.cast.run()
                        }
                    },
                );
            })
        },
        sizeChange ({height, width}) {
            this.$refs.cast.resize(width, height)
        },
        renderLoading (complete) {
            const loading = new TimelineMax()
            const dom = '.animates-layer'
            loading.set(dom, {display: 'block'})
            .to(dom, 0.3, {alpha: 1, onComplete: complete})
            .to(dom, 0.3, {alpha: 1})
            .to(dom,  1, {alpha: 0, ease: Power4.easeIn})
            .set(dom, {display: 'none'})
        },
        render25DDemo () {
            this.renderLoading(() => {
                this.status = 4
                this.$nextTick(() => {
                    this.$refs.img25D.init(
                        {
                            width: this.$refs['25DContainer'].offsetWidth,
                            height: this.$refs['25DContainer'].offsetHeight,
                            transparent: true
                        }
                    )
                })
            })
        }
    }
}
</script>

<style lang="scss">
.animates {
    background: #000;
    color: white;
    height: 100%;
    position: relative;
    overflow: hidden;
    #animates-title {
        display: none;
        position: absolute;
        top: 40%;
        right: 0;
        left: 0;
        text-align: center;
        font-size: 3em;
    }
    &-load {
        position: absolute;
        top: 40%;
        right: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        .animates-load-icon {
            width: 50px;
            height: 50px;
            margin: 0 20px;
            background-color: #ffffff;
            border-radius: 50%;
        }
    }
    #num2, #num1, #rabbit {
        display:none;
    }
    .animates-layer {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #000;
        display: none;
        z-index: 10;
    }
    .animates-25D {
        position: absolute;
        z-index: 5;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }
    &-cast {
        position: relative;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .cast-title {
            display: none;
            position: absolute;
            z-index: 4;
            left: 20%;
            top: 20%;
            font-size: 3em;
            letter-spacing: 2px;
            overflow: hidden;
        }
        img {
            position: absolute;
            transform-style: preserve-3d;
        }
        .cloud-bg {
            bottom: 17%;
            width: 80%;
            right: 100%;
            z-index: 1;
        }

        .cloud-bg2 {
            bottom: 17%;
            width: 80%;
            right: 100%;
            z-index: 1;
        }
        .land-bg {
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 180px;
        }
        .cast-bg {
            left: 0;
            right: 0;
            top: 0;
            width: 100%;
            z-index: 0;
            height: calc(100% - 180px);
        }
    }
}
</style>