<template>
    <section class="animates">
        <section
        class="animates-title"
        v-show="status >= 1"
        id="animates-title">
            {{title}}
        </section>
        <section class="animates-load" v-show="status >= 2">
            <section class="animates-load-icon"></section>
            <section class="animates-load-icon"></section>
            <section class="animates-load-icon"></section>
        </section>
    </section>
</template>

<script>
import {TweenMax, Back, TimelineMax} from 'gsap'
export default {
    name: 'animates',
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
            const t = new TimelineMax()
            t.staggerFrom(chars, 0.8, {opacity:0, scale:0, y:80, rotationX:180, transformOrigin:"0% 50% -50", ease:Back.easeOut}, 0.01);
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
        },
        createNum () {
            this.status = 2
            const t = new TimelineMax()
            t.staggerTo('.animates-load-icon',0.5, {opacity: 0.7, scale: '1.2'}, 0.5)
            t.staggerTo('.animates-load-icon',0.5, {opacity: 1, scale: '1'}, 0.5)
            t.repeat(-1)
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
    #animates-title {
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
}
</style>