<template>
    <p>But first, tell us your name!</p>
    <input style="flex-grow: unset;" v-model="username"/>
    <Button class="primary complete" @click="setName">Confirm</Button>
</template>

<script>
import Button from '../../button.vue'

export default {
    components: {
        Button
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