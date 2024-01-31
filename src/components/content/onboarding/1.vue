<template>
    <h1>Welcome to {{ title }}!</h1>
    <h3 style="text-align: center;">... and your personal journey of<br/>life-long learning!</h3>
    <br/>
    <p>With Bites you will be able to future-proof your skills by discovering new and exciting <b>Future Skills</b>.</p>
</template>

<script>
import { title } from '@/assets/data/names.js'
import Image from '../../image.vue';

export default {
    components: {
        Image
    },

    data() {
        return {
            title: title
        }
    }
};
</script>