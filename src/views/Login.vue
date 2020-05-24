<template>
    <section
    ref="login"
    class="login">
        <section
        ref="loginBg"
        class="login-bg"
        :style="`background-image: url('${bgUrl}');`"></section>
        <section
        v-show="!showLogin"
        class="current opacityAni">
            <p class="current-time">{{time}}</p>
            <p class="current-date">{{date}}，{{week}}</p>
        </section>
        <section
        v-if="showLogin"
        class="login-content">
            <section>
                <section class="login-content-avator">
                    <img :src="avator"/>
                </section>
                <section class="login-content-name">Justwiner</section>
                <section class="login-content-but" @click="login">登录</section>
            </section>
        </section>
        <just-load />
    </section>
</template>

<script>
import LoginService from '@/service/Login';
import {getWeek} from '@/lib/date';
import {fullScreenFun, fullScreenable, login} from '@/lib/tools';
import {mapState} from 'vuex';
import {TweenMax, Power4} from 'gsap';
import {ifPC} from '@/lib/tools';
import moment from 'moment';

export default {
    name: 'login',
    data() {
        let loginService = new LoginService();
        return {
            loginService,
            bgUrl: loginService.getRandomBgUrl(),
            avator: require('../assets/me.jpg'),
            time: '00:00:00',
            date: '01-01',
            week: '星期一',
            showLogin: false,
        }
    },
    computed: {
        ...mapState({
            currentTime: state => state.currentTime
        })
    },
    watch: {
        currentTime: {
            immediate: true,
            handler (time) {
                this.setTime(time);
            },
        }
    },
    created () {
        if (!ifPC()) {
            this.$router.push({
                name: 'notPC'
            })
            return
        }
    },
    mounted() {
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('mouseup', this.onKeyDown);
        // fullScreenFun()
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('mouseup', this.onKeyDown);
    },
    methods: {
        onKeyDown(e) {
            if (this.showLogin === true && e.keyCode !== 27) return
            const scale = document.body.offsetHeight / document.body.offsetWidth;
            const start = {
                left: -10,
                top: -10 * scale,
                right: -10,
                bottom: -10* scale,
                filter: 'blur(0)',
            }
            const end = {
                left: -70,
                top: -70 * scale,
                right: -70,
                bottom: -70 * scale,
                filter: 'blur(5px)',
            }
            if (e.keyCode === 27) {
                this.showLogin = false;
                TweenMax.fromTo(
                    this.$refs.loginBg,
                    .1,
                    end,
                    {
                        ...start,
                        ease: Power4.easeOut,
                    },
                );
            } else {
                this.showLogin = true;
                TweenMax.fromTo(
                    this.$refs.loginBg,
                    .1,
                    start,
                    {
                        ...end,
                        ease: Power4.easeOut,
                    },
                );
            }
        },
        setTime(time) {
            const current = moment(time);
            this.time = current.format('H:mm:s');
            this.date = current.format('MM月DD日');
            this.week = getWeek(current);
        },
        login() {
            login()
            this.$router.push({
                name: 'Home',
            })
        },
    },
};
</script>

<style lang='scss'>
.login {
    height: 100%;
    position: relative;
    animation: loginFrame .3s forwards;
    &-bg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-size: 100% 100%;
        z-index: -1;
    }
}
.login-content {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    color: #ffff;
    display: flex;
    justify-content: center;
    margin-top: 10%;
    animation: opacityAni .5s forwards;
    &-avator, &-name, &-but {
        text-align: center;
        width: 100%;
        text-align: center;
    }
    &-avator {
        width: 100%;
        margin-bottom: 1rem;
        img {
            width: 12rem;
            height: 12rem;
            border-radius: 50%;
            background: rgba(71, 146, 226, 0.6);
        }
    }
    &-name {
        font-size: 5rem;
    }
    &-but {
        width: 9rem;
        height: 2.5rem;
        line-height: 2.5rem;
        background: rgba(71, 146, 226, 0.6);
        border: rgba(71, 146, 226, 0.6) solid 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        &:hover {
            border-color: lightgray;
        }
    }
}
.current {
    position: absolute;
    left: 40px;
    bottom: 100px;
    color: white;
    &-time {
        font-size: 5rem;
    }
    &-date {
        font-size: 3rem;
    }
}

@keyframes loginFrame {
    0% {
        background: rgba($color: #000000, $alpha: .5);
    }
    100% {
        background: transparent
    }
}
</style>