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
        <div
        ref="weatherBox"
        :class="[
            weatherLoading ? 'fixBox-show' : ''
        ]"
        class="map-weather"
        v-if="weatherLoading">
            <i class="fa fa-spinner fa-spin"></i>
            <span>{{weatherStatus}}</span>
            <i class="fa fa-close" @click="closeWeatherBox"></i>
        </div>
    </section>
</template>

<script>
import MapService from './mapService'

export default {
    name: 'simpleMap',
    data () {
        return {
            id: Date.now(),
            map: null,
            weatherLayer: null,
            width: 0,
            height: 0,
            layerVisible: false,
            mapLoad: false,
            service: null,
            weatherStatus: '',
            weatherLoading: false
        }
    },
    mounted () {
        setTimeout(() => {
            this.width = this.$refs.simpleMap.clientWidth
            this.height = this.$refs.simpleMap.clientHeight
        }, 300)
        setTimeout(() => {
            this.map = new AMap.Map(`map-${this.id}`, {
                viewMode: '3D',
                pitch: 60,
                resizeEnable: true,
                zoom: 7,
                zooms: [3, 20],
            })
            this.map.plugin(['AMap.DistrictSearch', 'Map3D'], () => {
                this.weatherLayer = new AMap.Object3DLayer({ zIndex: 110, opacity: 1 });
                this.map.add(this.weatherLayer)
            })
            this.service = new MapService(this.map, this)
            this.map.on('complete', this.mapComplete)
        }, 500)
    },
    beforeDestroy() {
        this.map && this.map.destroy()
    },
    methods: {
        sizeChange(opt) {
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
        mapComplete () {
            this.service.renderWeather()
        },
        closeWeatherBox () {
            this.$refs.weatherBox.className = 'map-weather fixbox-hidden'
            setTimeout(() => {
                this.weatherLoading = false
            }, 400)
        }
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
    .fixBox-show {
        animation-delay: 1s;
    }
    .map-weather {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255, 255, 255, 0.7);
        color: #655f5f;
        padding: 3px 10px;
        border-radius: 5px;
        box-shadow: 1px 2px 4px rgba(0, 0, 0, .7);
        .fa-spinner {
            margin-right: 5px;
        }
        .fa-close {
            margin-left: 5px;
        }
    }
}
</style>