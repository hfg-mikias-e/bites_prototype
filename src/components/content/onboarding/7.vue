<template>
    <h1 style="font-size: 2em; margin-bottom: -0.25em;">Almost done! 🏁</h1>
    <h1>What name should we call you?</h1>
    <input style="flex-grow: unset;" v-model="username"/>
    <Button class="primary complete" :disabled="username === ''" @click="setName">Confirm</Button>
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