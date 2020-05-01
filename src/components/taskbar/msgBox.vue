<template>
    <section class="msg-box" v-if="visible" @click="close">
        <section ref="msgContent" class="msg-content" @click.stop="() => {}">
            <section v-if="msgList.length > 0"></section>
            <section ref="msgEmpty" class="msg-empty" v-else>没有新通知</section>
        </section>
    </section>
</template>

<script>
import {mapState} from 'vuex'

export default {
    name: 'msg-box',
    props: {
        visible: {
            default: false,
            type: Boolean
        }
    },
    watch: {
        visible (val) {
            if (val && this.msgList.length === 0) {
                setTimeout(() => {
                    this.$refs['msgEmpty'].style = 'opacity: 1'
                }, 300)
            }
        }
    },
    computed: {
        ...mapState({
            msgList: state => state.msgList
        })
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
            this.$refs['msgContent'].style = 'animation: comeOutRight .3s forwards;'
            setTimeout(() => {
                this.$emit('close')
            }, 300)
        }
    }
}
</script>

<style lang="scss">
.msg-box {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    left: 0;
    background-color: transparent;
}
.msg-empty {
    color: #A8A8AA;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: .9rem;
    opacity: 0;
}
.msg-content {
    width: 400px;
    height: calc(100% - 40px);
    background-color: rgba(33, 30, 32, .9);
    position: absolute;
    right: 0;
    top: 0;
    animation: comeInRight .3s forwards;
}
@keyframes comeInRight {
    0% {
        transform: translateX(100%);
    }
    100% {
        transform: translateX(0);
    }
}
@keyframes comeOutRight {
    0% {
        transform: translateX(0%);
    }
    100% {
        transform: translateX(100%);
    }
}
</style>