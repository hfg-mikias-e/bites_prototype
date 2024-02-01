<template>
    <ul>
        <li>Slowly breathe in for <b>4</b> seconds</li>
        <li>Hold your breath for <b>7</b> seconds</li>
        <li>Slowly breathe out for <b>8</b> seconds</li>
    </ul>

    <div class="row">
            <Image src="/img/slides/repeat2.png" style="width: 1em;"/>
            <p>Repeat up to <b>10</b> times</p>
        </div>
</template>

<script>
import Image from "../.././image.vue";

export default {
    components: {
        Image
    }
};
</script>
