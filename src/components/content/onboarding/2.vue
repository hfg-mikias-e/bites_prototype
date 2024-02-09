<template>
    <div id="alternating">
        <h1>Thinking
            <span id="accent">
                <Image style="transform: translate(-20%, -20%)" src="/img/accents/show-thinking.png" />
            </span>
        </h1>

        <div>
            <h2>Improvisation & Creativity</h2>
            <h4>face and react to new challenges with creativity and innovation</h4>
        </div>
        <div>
            <h2>Communication &<br />
                Conflict Resolution</h2>
            <h4>mitigate misunderstandings, uncertainties and conflicts to contribute to a harmonious environment</h4>
        </div>
        <div>
            <h2>Systemic & Critical Thinking</h2>
            <h4>recognize and accurately assess dynamics, relationships and situations to make informed decisions</h4>
        </div>
        <div>
            <h2>Self-Management</h2>
            <h4>boost your personal organization and productivity in order to manage tasks and responsibilities efficiently
            </h4>
        </div>
    </div>

    <!--
    <div style="border-radius: 0; background: linear-gradient(168deg, #284852 0%, #070710 75%); position: fixed; width: 100vw;
    height: 100vh; left: 0; top: 0; z-index: -1;"></div>
    -->
</template>

<script>
import Image from '../../image.vue'

export default {
    components: {
        Image
    },

    async created() {
        document.querySelector('meta[name="theme-color"]').setAttribute("content", "#284852")
        document.body.style.background = "linear-gradient(168deg, #284852 0%, #070710 75%)"
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