<template>
    <section ref="loadingLayer" class="loading-layer"></section>
</template>

<script>
export default {
    name: 'just-load',
    mounted () {
        setTimeout(() => {
            this.$refs.loadingLayer.style.display = 'none'
        }, 1100)
    }
}
</script>