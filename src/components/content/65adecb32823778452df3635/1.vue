<template>
    <video id="iframe" controls loop style="width: 100%;">
        <source src="/media/Massively Transformative Purpose (MTP).mp4" type="video/mp4">
    </video>
    <Button class="primary complete" @click="$emit('contentDone')">Done</Button>
</template>

<script>
import Button from "../.././button.vue"
import Image from "../.././image.vue"

export default {
    components: {
        Button,
        Image
    },

    emits: ["contentDone"]
};
</script>