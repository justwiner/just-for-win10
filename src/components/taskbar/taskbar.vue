<template>
    <section class="task-bar">
        <section
        @click="changeBox('appBoxVisible', true)"
        class="task-bar-windows task-bar-icon task-item"/>
        <section class="task-bar-search" @click="searhFocus">
            <section class="task-bar-search-prefix task-bar-icon"/>
            <input class="task-bar-search-textarea" type="text"/>
        </section>
        <section class="task-search-temp"></section>
        <section class="task-list">
            <section
            v-for="item in runingApp"
            :key="item.id"
            @click="setActiveApp(item)"
            :class="[
                activeApp && activeApp.id === item.id ? 'task-item-active' : ''
            ]"
            class="task-list-item task-item">
                <img :src="item.icon"/>
            </section>
        </section>
        <section class="task-tip">
            <section class="task-tip-date task-item" @click="changeBox('dateBoxVisible', true)">
                <section>{{time}}</section>
                <section>{{date}}</section>
            </section>
            <section class="task-tip-msg task-item task-bar-icon" @click="changeBox('msgBoxVisible', true)"></section>
        </section>
        <MsgBox
        ref="msgBox"
        @close="changeBox('msgBoxVisible', false)"
        :visible='msgBoxVisible'/>
        <DateBox
        ref="dateBox"
        @close="changeBox('dateBoxVisible', false)"
        :visible='dateBoxVisible'/>
        <AppBox
        ref="appBox"
        @close="changeBox('appBoxVisible', false)"
        :visible='appBoxVisible'/>
    </section>
</template>

<script>
import MsgBox from './msgBox'
import DateBox from './dateBox'
import AppBox from './appBox'
import moment from 'moment'
import {mapState} from 'vuex'

export default {
    name: 'task-bar',
    components: {
        MsgBox,
        DateBox,
        AppBox
    },
    computed: {
        ...mapState({
            currentTime: state => state.currentTime,
            runingApp: state => state.runingApp,
            activeApp: state => state.activeApp,
        })
    },
    data () {
        return {
            time: '',
            date: '',
            msgBoxVisible: false,
            dateBoxVisible: false,
            appBoxVisible: false
        }
    },
    watch: {
        msgBoxVisible (val) {
            if (val && this.dateBoxVisible) this.$refs.dateBox.close()
            if (val && this.appBoxVisible) this.$refs.appBox.close()
        },
        dateBoxVisible (val) {
            if (val && this.msgBoxVisible) this.$refs.msgBox.close()
            if (val && this.appBoxVisible) this.$refs.appBox.close()
        },
        appBoxVisible (val) {
            if (val && this.msgBoxVisible) this.$refs.msgBox.close()
            if (val && this.dateBoxVisible) this.$refs.dateBox.close()
        },
        currentTime: {
            immediate: true,
            handler (time) {
                this.getDateTime(time)
            }
        }
    },
    methods: {
        getDateTime (time) {
            this.time = moment(time).format('HH:mm')
            this.date = moment(time).format('YYYY/M/D')
        },
        changeBox (key, flag) {
            this[key] = flag
        },
        searhFocus () {
            if (this.dateBoxVisible) this.$refs.dateBox.close()
            if (this.msgBoxVisible) this.$refs.msgBox.close()
        },
        setActiveApp (app) {
            this.$store.commit('updateActiveApp', app)
            this.bus.$emit('activeAppFn', app)
        }
    }
}
</script>

<style lang="scss">
$task-height: 40px;
$windows-left: 10px;
$search-width: 18%;
$tip-width: 130px;
.task-bar {
    position: absolute;
    width: 100%;
    height: $task-height;
    background: #211E20;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 5000;
    &-icon {
        width: $task-height;
        height: $task-height;
        background-size: 50% 50%;
        background-position: center;
        background-repeat: no-repeat;
    }
    &-windows {
        background-image: url('../../assets/icon/windows.svg');
    }
    &-search {
        height: auto;
        width: $search-width;
        display: flex;
        align-items: center;
        background: white;
        position: absolute;
        bottom: 0;
        left: $task-height;
        &-prefix {
            background-image: url('../../assets/icon/search.svg');
            position: absolute;
            left: 0;
            top: 0;
            z-index: 10;
        }
        &-textarea {
            position: relative;
            border: none;
            outline: none;
            height: $task-height;
            overflow: auto;
            font-size: 1rem;
            width: 100%;
            padding: 8px 20px 8px $task-height;
            line-height: 1.5rem;
            border: 2px solid #ffffff;
            &:focus {
                border-color: #0078D7;
            }
            &:hover {
                border-color: #B4B4B4;
            }
        }
    }
    .task-search-temp, .task-list, .task-tip {
        height: 100%;
    }
    .task-search-temp {
        width: calc(#{$search-width} + 10px);
    }
    .task-list {
        width: calc(100% - #{$search-width} - #{$windows-left} - #{$tip-width});
        display: flex;
        align-items: center;
        justify-content: flex-start;
        overflow: hidden;
        &-item {
            height: $task-height;
            width: $task-height + 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            &::before {
                position: absolute;
                content: '';
                bottom: 0;
                left: 5px;
                right: 5px;
                margin: 0 auto;
                height: 2px;
                background-color: #76b9ed;
                transition: left .2s, right .2s;
            }
            img {
                width: calc((100% - 20px) * 0.8);
                height: 80%;
            }
        }
    }
    .task-tip {
        width: $tip-width;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &-msg {
            background-image: url('../../assets/icon/message.svg');
        }
        &-date {
            color: white;
            font-size: .7rem;
            width: calc(100% - #{$task-height});
            section {
                text-align: center;
                margin: 5px 0;
            }
        }
    }
    .task-item {
        &:hover {
            background-color: rgba(54, 52, 53, .8);
            transition: background-color .2s;
        }
        &:hover.task-list-item {
            &::before {
                left: 0;
                right: 0;
            }
        }
    }
    .task-item-active {
        background-color: rgba(54, 52, 53, .8);
    }
    .task-item-active.task-list-item {
        &::before {
            left: 0;
            right: 0;
        }
    }
}
</style>