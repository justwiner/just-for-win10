<template>
    <section class="layer" v-if="visible" @click="close">
        <section class="app-box-taskbar" ref="appBoxContent">
            <section class="app-box-power">
                <section class="auth-opt">
                    <i title="作者" class="fa fa-user-circle touch-item"></i>
                </section>
                <section class="power-opt">
                    <i
                    @click="powerSleep"
                    title="睡眠"
                    class="fa fa-power-off touch-item"></i>
                </section>
            </section>
            <section class="app-box-list">
                <section
                @click="runApp(item)"
                v-for="item in apps"
                :key="item.id"
                class="app-list-item touch-item">
                    <div><img :src="item.icon"/></div>
                    <span>{{item.name}}</span>
                </section>
            </section>
        </section>
    </section>
</template>

<script>
import {mapState} from 'vuex'
import AppService from '@/service/AppService'
const appService = new AppService()
export default {
    name: 'app-box-taskbar',
    props: {
        visible: {
            default: false,
            type: Boolean
        },
        searchValue: {
            default: '',
            type: String
        }
    },
    computed: {
        ...mapState({
            storeApps: state => state.app.filter(item => item.type !== 'temp'),
            runingApp: state => state.runingApp
        }),
        apps () {
            return this.storeApps.filter(item => item.name.includes(this.searchValue))
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
            })
        },
        close () {
            if (!this.$refs['appBoxContent']) return
            this.$refs['appBoxContent'].style = 'animation: comeOutBottom .3s forwards;'
            setTimeout(() => {
                this.$emit('close')
            }, 300)
        },
        powerSleep () {
            this.close()
            setTimeout(() => {
                this.$router.push({
                    path: '/login'
                })
            }, 400)
        },
        runApp (app) {
            appService.runApp(app, this)
        }
    }
}
</script>

<style lang="scss">
$appBoxWidth: 300px;
$appBoxMinHeight: 300px;
$appBoxMaxHeight: 500px;
$appPowerWidth: 40px;
$appListItemHeight: 40px;
.app-box-taskbar {
    width: $appBoxWidth;
    min-height: $appBoxMinHeight;
    max-height: $appBoxMaxHeight;
    position: absolute;
    bottom: 0;
    left: 0;
    animation: comeInBottom .3s forwards;
    background-color: rgb(44, 45, 46);
}
.app-box-power {
    width: $appPowerWidth;
    height: 100%;
    position: absolute;
    &>section {
        position: absolute;
        left: 0;
        right: 0;
        color: white;
        i {
            width: $appPowerWidth;
            height: $appPowerWidth;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    .power-opt {
        bottom: 0;
    }
    .auth-opt {
        top: 0;
    }
}
.app-box-list {
    width: $appBoxWidth - $appPowerWidth;
    min-height: $appBoxMinHeight;
    max-height: $appBoxMaxHeight;
    overflow-y: auto;
    float: right;
    padding: 10px 0;
    .app-list-item {
        color: white;
        height: $appListItemHeight;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 1px 10px;
        box-sizing: content-box;
        div {
            height: $appListItemHeight;
            width: $appListItemHeight;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
            img {
                width: 70%;
                height: 70%;
            }
        }
        span {
            font-size: .7em;
        }
    }
}
</style>