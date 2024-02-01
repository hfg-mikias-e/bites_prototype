<template>
    <img src="/img/slides/repeat.png" style="margin-bottom: 1.5em;"/>
    <h2>Step 4</h2>
    <b>Repeat!<Image id="accent" src="/img/slides/sparkle.png" style="transform: translate(15%, -35%); width:2.5em; position: absolute; z-index: -1"/></b>
    <p>Repeat this time sequence until you have successfully completed your task.</p>
    <b>After every four Pomodori (25-minute units), you should take a longer break of 15-30 minutes.</b>
    <Button class="primary complete" @click="$emit('contentDone')">Got it!</Button>
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