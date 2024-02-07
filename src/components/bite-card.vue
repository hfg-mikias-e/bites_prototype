<template>
    <div id="bite-container" class="row" :class="{ details: details, remind: remind, saved: saved, fav: fav }" v-if="content">
        <div id="iconLine" class="row">
            <h5 v-if="saved && $store.state.notifs.find(index => index.content === contentID) !== undefined && !$store.state.saved.includes(contentID)"
                id="saved-date">{{ $store.state.notifs.find(index => index.content === contentID).date }}</h5>
            <icon v-if="fav" :icon="heartIcon" @click.stop="$emit('setFav')" />
            <icon v-if="!remind && !fav" :icon="bookmarkIcon" @click.stop="$emit('setBookmark')" />
        </div>
        <div id="image" :style="{ backgroundImage: 'url(/img/content/' + contentID + '.png)' }"></div>
        <div id="information" :class="{ spacing: saved && !static }">
            <TransitionGroup name="list">
                <Badge v-if="static || fav || !saved || fav" :content="content" key="0" :area="skills.indexOf(content)">{{ content.skill }}</Badge>
                <h3 key="1">{{ content.name }}</h3>
                <h4 key="2" v-if="static || !saved">{{ content.description }}</h4>
                <h4 key="3" v-else-if="saved && !remind">saved to your library</h4>
                <div key="4" class="row" v-if="(!saved && details && !remind) || (remind && !details)" id="content-type">
                    <icon v-if="content.type" :icon="content.type" />
                    <h4 v-if="content.minutes">{{ content.minutes }} min</h4>
                    <h4 v-else-if="content.tag">{{ content.tag }}</h4>
                </div>
            </TransitionGroup>
        </div>
    </div>
</template>
  
<script>
import Image from "@/components/image.vue";
import Button from "@/components/button.vue";
import Badge from "@/components/badge.vue";
import { content, categories } from '@/assets/data/content.js'

export default {
    components: {
        Button,
        Image,
        Badge
    },

    data() {
        return {
            skills: content
        }
    },

    props: {
        content: Object,
        details: Boolean,
        remind: Boolean,
        due: Number,
        static: Boolean,
        saved: Boolean,
        fav: Boolean
    },

    emits: ['setBookmark', 'setFav'],

    computed: {
        image() {
            return "/img/content/" + this.contentID + ".png"
        },

        contentID() {
            return this.skills.indexOf(this.content)
        },

        bookmarkIcon() {
            if (this.content && !this.$store.state.saved.includes(this.contentID)) {
                return "fa-regular fa-bookmark"
            } else {
                return "bookmark"
            }
        },

        heartIcon() {
            if (this.content && this.$store.state.faved.includes(this.contentID)) {
                return "heart"
            } else {
                return "fa-regular fa-heart"
            }
        }
    },

    methods: {
        startContent() {
            if (this.content.practical) {
                this.$router.push('/sip/' + this.contentID)
            } else {
                this.$router.push('/bite/' + this.contentID)
            }
        }
    }
};
</script>
  
<style lang="scss">
@use "variables" as v;

#bite-container {
    background-color: v.$content-color;
    height: fit-content;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 0.5em;
    border-radius: 1em;
    flex-direction: row;
    width: 100%;
    gap: 0.75em;

    >* {
        width: 100%;
    }

    #image {
        aspect-ratio: 4/5;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 0.75em;
        width: 52%;
    }

    #iconLine {
        position: absolute;
        padding: inherit;
        margin: 0.125em 0.325em;
        top: 0;
        right: 0;
        z-index: 1;
        width: fit-content;
        height: fit-content;
        gap: 0.325em;

        >svg {
            height: 1.25em;
        }
    }

    &.details,
    &.saved,
    &.fav,
    &.remind {
        justify-content: flex-start;
        background: none;
        padding: 0;
    }

    &.due {
        background-color: red;
    }

    &.details {
        #image {
            aspect-ratio: 6/8;
        }
    }

    &.saved {
        padding: 0;

        #image {
            width: 32%;
            aspect-ratio: 1/1;
        }
    }

    #content-type {
        gap: 0.325em;

        h4 {
            font-weight: 500;
        }
    }

    #saved-date {
        opacity: 0.4;
        gap: 0.25em;
        width: fit-content;
        letter-spacing: -0.025em;
    }

    #information {
        flex-grow: 1;
        gap: 0.5em;
        max-height: 1px;

        &.spacing {
            h3 {
                width: 85%;
            }

        }

        >h4 {
            letter-spacing: -0.0175em;
            opacity: 0.6;
        }
    }
}
</style>