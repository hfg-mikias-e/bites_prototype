<template>
    <div id="alternating">
        <h1>Feeling
            <span id="accent">
                <Image style="transform: translate(-20%, -20%)" src="/img/accents/show-feeling.png" />
            </span>
        </h1>

        <div>
            <h2>Emotional Empathy</h2>
            <h4>build your compassion and empathy to create meaningful relationships</h4>
        </div>
        <div>
            <h2>Foster Relationships</h2>
            <h4>support the stability in your social environment to prevent feelings of loneliness and to create a
                supportive community</h4>
        </div>
        <div>
            <h2>Personal Well-Being</h2>
            <h4>promote your emotional and physical health to build up your resilience and ability to deal with
                challenges</h4>
        </div>
        <div>
            <h2>Appreciation</h2>
            <h4>practice your gratitude to create positive connections with yourself, the environment and others
            </h4>
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
        document.querySelector('meta[name="theme-color"]').setAttribute("content", "#5D2F57")
        document.body.style.background = "linear-gradient(168deg, #5D2F57 0%, #070710 75%)"
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