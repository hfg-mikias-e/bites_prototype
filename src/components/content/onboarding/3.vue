<template>
    <div id="alternating">
        <h1>Acting
            <span id="accent">
                <Image style="transform: translate(-20%, -20%)" src="/img/accents/show-acting.png" />
            </span>
        </h1>

        <div>
            <h2>Collaboration</h2>
            <h4>generate support to foster a positive and productive team environment</h4>
        </div>
        <div>
            <h2>Teaching</h2>
            <h4>clearly communicate your concepts & visions to others to shape ideas and contribute to the exchange of knowledge</h4>
        </div>
        <div>
            <h2>Inspire Others</h2>
            <h4>create mission statements that help guide and motivate yourself and others towards common goals</h4>
        </div>
        <div>
            <h2>Self-Confidence</h2>
            <h4>find the courage to stand up for your beliefs and goals to promote your personal & professional development</h4>
        </div>
        <div>
            <h2>Sense of Responsibility</h2>
            <h4>understand one's impact on the environment and the wider consequences to act accordingly</h4>
        </div>
    </div>
</template>

<script>
import Image from '../../image.vue'

export default {
    components: {
        Image
    },

    async created() {
        document.querySelector('meta[name="theme-color"]').setAttribute("content", "#58502B")
        document.body.style.background = "linear-gradient(168deg, #58502B 0%, #070710 75%)"
        this.$emit("stars", true)
    },

    async beforeUnmount() {
        await document.querySelector('meta[name="theme-color"]').setAttribute("content", "#1C1725")
    }
}
</script>

<style lang="scss">
@use "variables" as v;

#alternating {
    gap: 3.25em;

    h2 {
        line-height: 125%;
    }

    h4 {
        opacity: 0.75;
        font-weight: 400;
        max-width: 80%;
        line-height: 140%;
    }

    div {
        display: flex;
        gap: 0.25em;

        &:nth-child(2n) {
            text-align: right;
            align-items: flex-end;

            h2,
            h4 {
                text-align: right;
            }
        }
    }
}
</style>