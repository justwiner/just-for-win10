<template>
    <section class="desktop">
        <draggable
        class="desktop-draggable"
        v-model="apps"
        draggable=".app-drag"
        @start='dragStart'
        @end='dragEnd'>
            <AppItem
            @click='itemClick'
            @run='runApp'
            :index='index'
            :active='active === index'
            :key="index"
            v-for="(app, index) in apps"
            :app='app'/>
            <div class="desktop-draggable-layer" v-if="!draging"></div>
        </draggable>
        <AppContainerIframe
        @closeApp='closeApp'
        v-for="app in runingApp"
        :key="app.id"
        :app='app'
        />
    </section>
</template>

<script>
import AppItem from './appItem'
import draggable from 'vuedraggable'
import AppContainerIframe from '@/components/appContainer/iframe'
import AppService from '@/service/AppService'
import {mapState} from 'vuex'

const appService = new AppService()

export default {
    name: 'desktop',
    components: {
        AppItem,
        draggable,
        AppContainerIframe
    },
    computed: {
        apps: {
            get () {
                return this.$store.state.app
            },
            set (value) {
                this.$store.commit('updateApps', value)
            }
        },
        ...mapState({
            runingApp: state => state.runingApp
        })
    },
    data () {
        return {
            active: '',
            draging: false
        }
    },
    methods: {
        itemClick (active) {
            this.active = active
        },
        runApp (app, index) {
            const runingApp = this.runingApp
            runingApp.push(app)
            this.$store.commit('updateRuningApp', runingApp)
        },
        closeApp (app) {
            this.$store.commit('updateRuningApp', appService.closeApp(this.runingApp, app))
        },
        dragStart () {
            this.draging = true
        },
        dragEnd () {
            this.draging = false
        }
    }
}
</script>

<style lang="scss">
.desktop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 40px;
    & > div {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
    }
}
.desktop-draggable {
    position: relative;
}
.desktop-draggable-layer {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 3;
}
</style>