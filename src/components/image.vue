<template>
    <Transition name="fade">
        <img :src="src" @load="imgLoaded = true" v-show="imgLoaded" />
    </Transition>
</template>
    
<script>
export default {
    props: {
        src: String
    },

    data() {
        return {
            imgLoaded: false
        };
    },
}
</script>

<style lang="scss">
@use 'variables' as v;

img {
    border-radius: 0;
    background-color: v.$content-color
}
</style>