<template>
    <section class="layer" v-if="visible" @click="close">
        <section ref="dateContent" class="date-content" @click.stop="() => {}">
            <section class="date-content-date">
                <section class="dcd-time">{{time}}</section>
                <section class="dcd-info">{{info}}</section>
            </section>
            <WinCalendar
            class="date-content-calendar"
            :lunar="true"
            :value="calendarDate"
            @select="dateChange"/>
            <section class="date-todo" v-show="todoVisiable">
                <section class="date-todo-title">{{todoTitle}}</section>
                <section class="date-todo-input">
                    <input type="text" placeholder="添加事件或提醒"/>
                </section>
                <section class="date-todo-list">
                    todo模块暂未开发
                </section>
            </section>
            <section class="date-todo-hiden" @click="changeTodoVisible">
                隐藏日程
                <i :class="[todoVisiable ? 'fa-angle-down' : 'fa-angle-up']" class="fa"></i>
            </section>
        </section>
    </section>
</template>

<script>
import {mapState} from 'vuex'
import moment from 'moment'
import {getWeek} from '@/lib/date'
import calendar from '@/lib/calendar'
import DateService from '@/service/DateService'
import WinCalendar from '@/components/win-calendar/index'

export default {
    name: 'date-box',
    components: {
        WinCalendar
    },
    props: {
        visible: {
            default: false,
            type: Boolean
        }
    },
    computed: {
        ...mapState({
            currentTime: state => state.currentTime
        }),
        calendarDate () {
            return this.selectDate.split('-')
        },
        todoTitle () {
            const parmas = moment(this.selectDate).format('Y-M-D').split('-')
            return `
            ${getWeek(moment(this.selectDate))} 
            ${moment(this.selectDate).format('D')} 
            ${calendar.solar2lunar(...parmas).lunarText} 
            ${calendar.getHoliday(...parmas).lunar}
            `
        }
    },
    watch: {
        currentTime: {
            immediate: true,
            handler (time) {
                this.getDateTime(time)
            }
        }
    },
    data () {
        return {
            time: '',
            selectDate: '',
            currentDate: '',
            info: '',
            dateService: new DateService(),
            todoVisiable: true
        }
    },
    mounted () {
        this.init()
        this.selectDate = moment().format('YYYY-MM-DD')
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
        getDateTime (time) {
            const current = moment(time)
            const parmas = current.format('Y-M-D').split('-')
            this.currentDate = current.format('YYYY-MM-DD')
            this.time = current.format('HH:mm:ss')
            let holiday = calendar.getHoliday(...parmas).lunar
            this.info = `${current.format('YYYY年MM月DD日')} ${calendar.solar2lunar(...parmas).lunarText} ${holiday}`
        },
        dateChange (date) {
            this.selectDate = date.join('-')
        },
        changeTodoVisible () {
            this.todoVisiable = !this.todoVisiable
        },
        close () {
            this.$refs['dateContent'].style = 'animation: comeOutBottom .3s forwards;'
            setTimeout(() => {
                this.$emit('close')
            }, 300)
        }
    }
}
</script>

<style lang="scss">
.date-content {
    width: 20%;
    background-color: rgb(44, 45, 46);
    position: absolute;
    right: 0;
    bottom: 40px;
    animation: comeInBottom .3s forwards;
    padding: 1% 1% 3% 1%;
    &-date {
        padding-bottom: 8%;
        border-bottom: 1px solid #383838;
        .dcd-time {
            color: white;
            font-size: 3rem;
        }
        .dcd-info {
            color: #A5D7FE;
            cursor: pointer;
            font-size: .9rem;
            &:hover {
                color: #959598;
            }
        }
    }
    &-calendar {
        margin-top: 5%;
        border-bottom: 1px solid #383838;
    }
    .date-todo {
        margin-top: 5%;
        position: relative;
        &-title {
            color: #ffffff;
            font-size: 1.3rem;
        }
        &-input {
            margin-top: 2%;
            input {
                width: 100%;
                height: 30px;
                background-color: transparent;
                border: 1px solid #6B6B6B;
                padding: 0 11px;
                color: white;
                &:hover {
                    background-color: #181818;
                }
                &:focus {
                    background-color: white;
                    color: #181818;
                }
            }
        }
        &-list {
            margin-top: 5%;
            color: #ccc;
            font-size: .9rem;
        }
    }

    .date-todo-hiden {
        position: absolute;
        right: 4%;
        bottom: 2%;
        color: #A5D7FE;
        font-size: .9rem;
        &:hover {
            color: #959598;
        }
    }
}
</style>