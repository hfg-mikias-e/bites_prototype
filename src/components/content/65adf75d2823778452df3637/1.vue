<template>
    <div id="iframe" style="height: calc(100% - 2.5em)">
        <iframe src="https://pomofocus.io/"/>
    </div>
    <Button class="primary complete" @click="$emit('contentDone')">Done</Button>
</template>

<script>
import Button from "../.././button.vue";
import Image from "../.././image.vue";

export default {
    components: {
        Button,
        Image
    },

    emits: ["contentDone"]
};
</script>