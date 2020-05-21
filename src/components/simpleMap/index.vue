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
        <el-card class="map-opt">
            <section class="map-opt-title">气候温度可视化</section>
            <section class="map-opt-item">
                <el-tooltip effect="light" content="请输入区域拼音，例如：zhejiang/chongqing" placement="top">
                    <label>查询区域：</label>
                </el-tooltip>
                <section class="map-opt-item-form">
                    <el-input size="mini" v-model="areaName" placeholder="请输入区域名称">
                        <el-button @click="getWetherData" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </section>
            </section>
            <section class="map-opt-item">
                <label>天气：</label>
                <section class="map-opt-item-form">
                    <el-switch
                        v-model="weatherVisible"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </section>
            </section>
            <section class="map-opt-item">
                <label>温度：</label>
                <section class="map-opt-item-form">
                    <el-switch
                        v-model="temperatureVisible"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </section>
            </section>
            <section v-if="false" class="map-opt-title">全球风场可视化</section>
            <section v-if="false" class="map-opt-item">
                <label>风场：</label>
                <section class="map-opt-item-form">
                    <el-switch
                        v-model="windVisible"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </section>
            </section>
        </el-card>
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
            width: 0,
            height: 0,
            layerVisible: false,
            mapLoad: false,
            service: null,
            weatherStatus: '',
            weatherLoading: false,
            weatherLayer: null,
            temperatureLayer: null,
            windLayer: null,
            weatherVisible: true,
            temperatureVisible: true,
            windVisible: true,
            areaName: 'china',
            infoWindow: null,
            windowDic: {
                'temperatureLayer': this.temWindow,
                'weatherLayer': this.weatherWindow,
                'windLayer': this.windWindow
            }
        }
    },
    watch: {
        weatherVisible (val) {
            if (val) {
                this.weatherLayer.show()
            } else {
                this.weatherLayer.hide()
            }
        },
        temperatureVisible (val) {
            if (val) {
                this.temperatureLayer.show()
            } else {
                this.temperatureLayer.hide()
            }
        },
        windVisible (val) {
            if (val) {
                this.windLayer.show()
            } else {
                this.windLayer.hide()
            }
        }
    },
    mounted () {
        setTimeout(() => {
            this.width = this.$refs.simpleMap.clientWidth
            this.height = this.$refs.simpleMap.clientHeight
        }, 300)
        setTimeout(() => {
            this.initMap()
        }, 500)
    },
    beforeDestroy() {
        this.map && this.map.destroy()
    },
    methods: {
        initMap () {
            this.map = new AMap.Map(`map-${this.id}`, {
                viewMode: '3D',
                pitch: 60,
                resizeEnable: true,
                zoom: 7,
                zooms: [3, 20],
            })
            this.map.plugin(['Map3D'], () => {
                this.weatherLayer = new AMap.Object3DLayer({ zIndex: 110, opacity: 1 });
                this.temperatureLayer = new AMap.Object3DLayer({ zIndex: 109, opacity: 1 });
                this.map.add(this.weatherLayer)
                this.map.add(this.temperatureLayer)
                window.map = this.map
            })
            this.map.plugin(['AMap.ControlBar'], () => {
                this.map.addControl(new AMap.ControlBar());
            })
            this.service = new MapService(this.map, this, this.areaName)
            this.map.on('complete', this.mapComplete)
            this.map.on('mousemove', this.mapMouseMove)
            this.infoWindow = new AMap.InfoWindow({
                content: ''
            });
        },
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
        async mapComplete () {
            await this.service.getWeather(this.areaName)
            this.service.renderWeather(this.areaName)
            this.service.renderTemperature()
            // this.service.renderWindLayer()
        },
        async getWetherData () {
            await this.service.getWeather(this.areaName)
            this.service.renderWeather()
            this.service.renderTemperature()
        },
        closeWeatherBox () {
            if (this.$refs.weatherBox) {
                this.$refs.weatherBox.className = 'map-weather fixbox-hidden'
            }
            setTimeout(() => {
                this.weatherLoading = false
            }, 400)
        },
        weatherWindow (data) {
            let divStr = `
            <div class='map-info-item'>城市：${data.cityname}</div>
            <div class='map-info-item'>天气：${data.stateDetailed}</div>
            `
            if (data.humidity) {
                divStr += `<div class='map-info-item'>空气质量：${data.humidity}</div>`
            }
            if (data.time) {
                divStr += `<div class='map-info-item'>数据更新时间：${data.time}</div>`
            }
            divStr += `<div class='map-info-item'>风向：${data.windState}</div>`
            return divStr
        },
        temWindow (data) {
            let divStr = `
            <div class='map-info-item'>城市：${data.cityname}</div>
            <div class='map-info-item'>最低温度：${data.tem2}℃</div>
            <div class='map-info-item'>最高温度：${data.tem1}℃</div>
            `
            if (data.temNow) {
                divStr += `<div class='map-info-item'>当前温度：${data.temNow}℃</div>`
            }
            return divStr
        },
        windWindow (data) {
            return '1'
        },
        mapMouseMove (event) {
            const pixel = event.pixel;
            const px = new AMap.Pixel(pixel.x, pixel.y);
            /**
             * 拾取鼠标所在位置的3D对象
             */
            const obj = this.map.getObject3DByContainerPos(px, [
                this.weatherLayer,
                this.temperatureLayer
            ], false) || {};
            if (!obj.index) {
                this.infoWindow.close()
                return
            }
            // 选中的 3d对象所在的索引
            const index = obj.index;
            // 选中的 object3D 对象，这里为当前 Mesh
            const object = obj.object;
            let data = null
            if (object.data instanceof Array) {
                data = object.data[index]
            } else if (object.data) {
                data = object.data
            }
            if (!data) return
            let content = this.windowDic[data.layer](data)
            this.infoWindow.setContent(content)
            if (!this.infoWindow.getIsOpen()) {
                this.infoWindow.open(this.map, event.lnglat)
            } else {
                this.infoWindow.setPosition(event.lnglat)
            }
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
        z-index: 1000;
        .fa-spinner {
            margin-right: 5px;
        }
        .fa-close {
            margin-left: 5px;
        }
    }
    .map-opt {
        position: absolute;
        left: 10px;
        top: 10px;
        .map-opt-item {
            display: flex;
            align-items: center;
            font-size: .7em;
            margin-bottom: 10px;
            padding-left: 13px;
            label {
                margin-right: 10px;
                width: 70px;
            }
            .map-opt-item-form {
                width: calc(100% - 80px);
            }
        }
        .map-opt-title {
            border-left: 3px solid #409eff;
            padding-left: 10px;
            margin-bottom: 10px;
            letter-spacing: 1px;
            font-size: .8em;
        }
    }
    .map-info-item {
        font-size: .7em;
    }
}
</style>