<template>
    <h1 style="font-size: 2em;">Welcome to <span id="accent">{{ title }}!
            <Image src="/img/accents/sparkle.png" />
        </span><br />Your Place for learning
        <span id="accent">Future Skills</span> on the go
    </h1>
    <Image style="background: none; max-width: unset; width: 120vw; transform: translate(-20vw)"
        src="/img/cookieverse.png" />
    <div id="note" style="opacity: 1; right: 0; bottom: 5%;">
        <h2 style="transform: rotate(-12deg);">swipe to take a<br/>look at all skills!</h2>
        <Image style="width: 2.5em;" src="/img/accents/arrow.png" />
    </div>
</template>

<script>
import { title } from '@/assets/data/names.js'
import Image from '../../image.vue';

export default {
    components: {
        Image
    },

    emits: ['stars'],

    data() {
        return {
            title: title
        }
    },

    created() {
        this.$emit("stars", true)
        document.body.style.background = "none"
    }
};
</script>

<style lang="scss">
@use "variables" as v;

#accent {
    color: v.$primary-color;

    img {
        background: none;
        width: 1em;
        position: absolute;
        transform: translate(20%);
    }
}
</style>