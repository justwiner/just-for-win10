<template>
    <section class="simple-map" ref="simpleMap">
        <div
        v-show="!mapLoad"
        :style="`width: ${width}px; height: ${height}px`"
        class="simple-map-container"
        :id="`map-${id}`"></div>
        <div
        ref="mapLayer"
        v-show="layerVisible"
        class="simple-map-layer"></div>
    </section>
</template>

<script>
export default {
    name: 'simpleMap',
    data () {
        return {
            id: Date.now(),
            map: null,
            width: 0,
            height: 0,
            layerVisible: false,
            mapLoad: false
        }
    },
    mounted () {
        setTimeout(() => {
            this.width = this.$refs.simpleMap.clientWidth
            this.height = this.$refs.simpleMap.clientHeight
        }, 300)
        setTimeout(() => {
            this.map = new AMap.Map(`map-${this.id}`, {
                resizeEnable: true
            })
        }, 500)
    },
    methods: {
        sizeChange (opt) {
            this.mapLoad = true
            this.layerVisible = true
            this.$refs.mapLayer.className = 'simple-map-layer'
            this.width = opt.width
            this.height = opt.height
            setTimeout(() => {
                this.mapLoad = false
                setTimeout(() => {
                    this.$refs.mapLayer.className = 'simple-map-layer layer-hidden'
                    setTimeout(() => {
                        this.layerVisible = false
                    }, 300)
                }, 500)
            }, 500)
        },
    }
}
</script>

<style lang="scss">
.simple-map {
    height: 100%;
    position: relative;
    &-layer {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: #ffffff;
    }
    * {
        transition: top 0s,
                left 0s,
                right 0s,
                bottom 0s,
    }
}
</style>