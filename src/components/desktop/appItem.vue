<template>
    <section
    @click="select"
    @dblclick="runApp"
    :class="[
    active ? 'app-item-active' : ''
    ]"
    class="app-item app-drag"
    v-if="app.type !== 'temp'">
        <section class="app-item-icon">
            <img :src="app.icon"/>
        </section>
        <section class="app-item-name">{{app.name}}</section>
    </section>
    <section
    @click="selectElse"
    class="app-temp app-drag" draggable="false" v-else>

    </section>
</template>

<script>
export default {
    name: 'app-item',
    props: {
        app: {
            default: () => {},
            type: Object
        },
        active: {
            default: false,
            type: Boolean
        },
        index: {
            default: 0,
            type: Number
        }
    },
    methods: {
        select () {
            this.$emit('click', this.index)
        },
        selectElse () {
            this.$emit('click', '')
        },
        runApp () {
            this.$emit('run', this.app, this.index)
        }
    }
}
</script>

<style lang="scss">
$app-width: 4.5vw;
$app-height: 5.5vw;
.app-item-active {
    border-color: lightgray;
    background-color: rgba($color: #ffffff, $alpha: .3);
}
.app-item {
    margin: 10px;
    height: $app-height;
    width: $app-width;
    border: 1px solid transparent;
    padding: 5px;
    z-index: 5;
    &:hover {
        border-color: lightgray;
        background-color: rgba($color: #ffffff, $alpha: .3);
    }
    &-icon {
        width: calc(100% - 20px);
        height: calc(#{$app-width} - 30px);
        margin: 0 10px;
        img {
            width: 100%;
            height: 100%;
        }
    }
    &-name {
        color: #ffffff;
        font-size: .8rem;
        transform: scale(.9);
        text-shadow: 2px 2px 5px #000;
        text-align: center;
        display:-webkit-box; 
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2; 
        text-overflow: ellipsis;
        overflow: hidden;
        margin-top: 5px;
    }
}
.app-temp {
    height: calc(#{$app-height} + 20px);
    width: calc(#{$app-width} + 20px);
    z-index: 1;
}
</style>