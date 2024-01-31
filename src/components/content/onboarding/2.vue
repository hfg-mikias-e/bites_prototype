<template>
    <p>We put a lot of emphasis of integrating them into your daily life to build your confidence, so get ready for both...</p>
    
    <div class="row" style="gap: 0.5em;">
        <Image style="margin: 0; width: 2em;" src="/img/bite.svg"/>
        <h2>"Bites"</h2>
        <p>(= theoretical content)</p>
    </div>
    <p>&</p>
    <div class="row" style="gap: 0.5em;">
        <Image style="margin: 0; width: 2em;" src="/img/sip.svg"/>
        <h2>"Sips"</h2>
        <p>(= practical exercises)</p>
    </div>
</template>

<script>
import Button from '../../button.vue'
import Image from '../../image.vue'

export default {
    components: {
        Button,
        Image
    },

    data() {
        return {
            username: ""
        }
    },

    emits: ["contentDone"],

    methods: {
        setName() {
            this.$store.dispatch('setUsername', this.username)
            this.$emit('contentDone')
        }
    }
}
</script>

<style lang="scss">
@use 'variables' as v;


</style>