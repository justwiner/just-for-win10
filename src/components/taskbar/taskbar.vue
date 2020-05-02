<template>
    <section class="task-bar">
        <section class="task-bar-windows task-bar-icon task-item"/>
        <section class="task-bar-search" @click="searhFocus">
            <section class="task-bar-search-prefix task-bar-icon"/>
            <input class="task-bar-search-textarea" type="text"/>
        </section>
        <section class="task-search-temp"></section>
        <section class="task-list">

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
    </section>
</template>

<script>
import MsgBox from './msgBox'
import DateBox from './dateBox'
import moment from 'moment'
import {mapState} from 'vuex'

export default {
    name: 'task-bar',
    components: {
        MsgBox,
        DateBox
    },
    computed: {
        ...mapState({
            currentTime: state => state.currentTime
        })
    },
    data () {
        return {
            time: '',
            date: '',
            msgBoxVisible: false,
            dateBoxVisible: false
        }
    },
    watch: {
        msgBoxVisible (val) {
            if (val && this.dateBoxVisible) this.$refs.dateBox.close()
        },
        dateBoxVisible (val) {
            if (val && this.msgBoxVisible) this.$refs.msgBox.close()
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
    z-index: 1000;
    &-icon {
        width: $task-height;
        height: $task-height;
        background-size: 50% 50%;
        background-position: center;
        background-repeat: no-repeat;
    }
    &-windows {
        background-image: url('../../assets/icon/windows.svg');
        margin-left: $windows-left;
    }
    &-search {
        height: auto;
        width: $search-width;
        display: flex;
        align-items: center;
        background: white;
        position: absolute;
        bottom: 0;
        left: $task-height + $windows-left;
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
    }
}
</style>