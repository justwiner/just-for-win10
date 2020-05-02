<template>
    <section class="desktop">
        <draggable v-model="apps" draggable=".app-drag">
            <AppItem
            @click='itemClick(index)'
            :index='index'
            :active='active === index'
            :key="index"
            v-for="(app, index) in apps"
            :app='app'/>
        </draggable>
    </section>
</template>

<script>
import AppItem from './appItem'
import draggable from 'vuedraggable'

export default {
    name: 'desktop',
    components: {
        AppItem,
        draggable
    },
    computed: {
        apps: {
            get () {
                return this.$store.state.app
            },
            set (value) {
                this.$store.commit('updateApps', value)
            }
        }
    },
    data () {
        return {
            active: ''
        }
    },
    methods: {
        itemClick (active) {
            this.active = active
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
</style>