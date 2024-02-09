<template>
    <h1>Bites</h1>
    <Image style="background: none; max-width: 80%; margin: 4em auto;" src="/img/done/bite-done-1.png" />
    <h2>Bites are theoretical content</h2>
    <h4 style="line-height: 140%;">In the app, you will be familiarized with different ways of thinking, techniques or new ideas through theoretical content, so-called bites. This allows you to learn something new every day!</h4>
</template>

<script>
import Image from '../../image.vue'

export default {
    components: {
        Image
    },

    created() {
        this.$emit("stars", false)
        document.body.style.background = "none"
    }
}
</script>