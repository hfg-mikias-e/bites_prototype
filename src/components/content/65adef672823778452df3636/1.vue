<template>
    <div id="slideBackground" style="background-color: #50927c">
    <video id="iframe" playsinline muted loop autoplay style="width: 90%; height: 100%;">
        <source src="/media/breathing.mov" type="video/mp4">
    </video>
    </div>
    <Button class="complete" @click="$emit('contentDone')">Done</Button>
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