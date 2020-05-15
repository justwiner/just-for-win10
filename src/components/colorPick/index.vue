<template>
    <section class="colorPick" ref="content">
        <div class="chart-content" ref="colorPick"></div>
        <div class="colorPick-context">
            此配色方案参考了<a target="blank" href="https://ant.design/docs/spec/colors-cn">antd-design的色彩搭配</a>。
        </div>
        <div class="colorPick-context">
            antd-design的配色方案可以用于大部分网站，站长在开发的时候，也偷偷去antd-design官网吸颜色🎨🎨🎨
        </div>
        <div class="colorPick-context">
            当然也有以上颜色不满足的情况，这个时候就需要自己手动选颜色了。
        </div>
        <div class="colorPick-context color-demo-box">
            <just-poper
            title=''
            content='123'
            placement='top'
            >
                <sketch-picker
                v-show="pickerVisible"
                v-model="color"
                @input="updateValue"></sketch-picker>
                <div
                slot="reference"
                @click="pickerVisible = true"
                :style="`background-color: ${color}`"
                class="color-demo ltMove"></div>
            </just-poper>
            <div
            @click="copyColor(color)"
            class="color-demo-box-text"
            :style="`width: 100px;color: ${color}`">
                {{color}}
            </div>
            <div
            @click="copyColor(rgbaColor)"
            class="color-demo-box-text"
            :style="`width: 200px;color: ${rgbaColor}`">
                {{rgbaColor}}
            </div>
        </div>
    </section>
</template>

<script>
import echarts from 'echarts'
import options from './colorsData'
import {Sketch} from 'vue-color'
import {copyText} from '@/lib/helper-dom'

export default {
    name: 'colorPick',
    components: {
        'sketch-picker': Sketch
    },
    data () {
        return {
            chartInstance: null,
            color: '#ffffff',
            rgbaColor: 'rgba(255, 255, 255, 1)',
            pickerVisible: false,
        }
    },
    mounted () {
        this.chartInstance = echarts.init(this.$refs.colorPick)
        this.chartInstance.setOption(options)
        this.chartInstance.on('click', (params) => {
            this.copyColor(params.data[2])
        })
        setTimeout(() => {
            this.sizeChange({
                width: this.$refs.content.clientWidth,
                height: this.$refs.content.clientHeight
            })
        }, 200)
    },
    methods: {
        sizeChange (opt) {
            this.$nextTick(() => {
                const size = Math.min(opt.width, opt.height) / 1.5
                this.chartInstance.resize({
                    width: size,
                    height: size
                })
            })
        },
        copyColor (color) {
            copyText(color)
            this.$message({
                type:'success',
                text: `复制成功：${color}`,
                parent: this.$refs.content
            });
        },
        updateValue (val) {
            this.color = val.hex
            this.rgbaColor = `rgba(${val.rgba.r}, ${val.rgba.g}, ${val.rgba.b}, ${val.rgba.a})`
        }
    }
}
</script>

<style lang="scss">
.colorPick {
    height: 100%;
    background: rgba($color: #fff, $alpha: .8);
    position: relative;
    overflow-y: auto;
    padding: 0 20px;
    .chart-content {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .colorPick-context {
        text-align: center;
        margin: 10px 0;
    }
    .color-demo {
        width: 80px;
        height: 30px;
        border-radius: 5px;
        cursor: pointer;
    }
    .color-demo-box {
        display: flex;
        justify-content: center;
        align-items: center;
        &-text {
            margin-left: 20px;
            background: #fff;
        }
    }
}
</style>