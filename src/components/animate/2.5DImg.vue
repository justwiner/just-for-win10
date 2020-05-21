<template>
    <div :id="id" class="img25D-container"></div>
</template>

<script>
import {Sine} from 'gsap'

export default {
    name: 'Img2.5D',
    props: {
        url: {
            type: String,
            default: ''
        },
        spriteUrl: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            width: 1920,
            height: 905,
            transparent: true,
            id: '2.5D-' + Math.random()
        }
    },
    beforeDestroy () {
        const el = document.getElementById(this.id)
        el && (el.onmousemove = null)
    },
    methods: {
        init (opt) {
            this.width = opt.width || 1920
            this.height = opt.height || 905
            this.transparent = opt.transparent || true
            this.create()
        },
        create (option = {
                width: this.width,
                height: this.height,
                transparent: this.transparent,
            }) {
            let app = new PIXI.Application(option);
            let renderer = app.renderer;
            let preview;
            let displacementSprite;
            let displacementFilter;
            let stage;
            let playground = document.getElementById(this.id);

            function setScene(url, spriteUrl) {

                playground.appendChild(renderer.view);

                stage = new PIXI.Container();

                preview = PIXI.Sprite.fromImage(url);

                displacementSprite = PIXI.Sprite.fromImage(spriteUrl);

                displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

                displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);

                stage.addChild(preview);

                stage.addChild(displacementSprite);

                app.stage.addChild(stage);
            }


            let cmWidth = option.width / 2
            let cmHeight = option.height / 2

            let velocity = -0.05;
            let move = {
                x: 0,
                y: 0
            };

            playground.onmousemove = function (e) {
                TweenMax.to(move, 1, {
                    x: e.clientX,
                    y: e.clientY,
                    ease: Sine.easeOut,
                    onUpdateParams:["{self}"]
                });
            }

            let auto = {
                x: 0,
                y: 0
            }
            TweenMax.to(auto, 2, {
                x: 20,
                y: 70,
                repeat: -1,
                yoyo: true,
                ease: Sine.easeInOut,
                onUpdate: function (param1) {
                    stage.filters = [displacementFilter];
                    if (typeof param1 === 'string') {
                        return
                    }
                    displacementFilter.scale.set(param1.target.x + (move.x - cmWidth) * velocity, param1.target.y + (move.y - cmHeight) * velocity);

                },
                onUpdateParams:["{self}"]
            })

            setScene(this.url, this.spriteUrl);
        }
    }
}
</script>

<style lang="scss">
.img25D-container {
    overflow: hidden;
    height: 100%;
    width: 100%;
    canvas {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(1.05);
    }
}
</style>