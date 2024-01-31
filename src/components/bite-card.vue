<template>
    <Transition name="list">
        <div id="bite-container" class="row" :class="{ saved: saved, details: details, fav: fav, remind: remind, due: due }" v-if="content">
            {{  due }}
            <div id="iconLine" class="row">
                <h5 v-if="content.saved && content.time && !saved" id="saved-date">{{ content.time }}</h5>
                <icon v-if="fav" :icon="heartIcon" @click.stop="$emit('setFav')" />
                <icon v-if="(saved || !remind) && !fav" :icon="bookmarkIcon" @click.stop="$emit('setBookmark')" />
            </div>
            <div id="image" :style="{ backgroundImage: 'url(/img/content/' + content._id + '.png)' }"></div>
            <div id="information" :class="{ spacing: saved }">
                <TransitionGroup name="list">
                    <Badge v-if="!saved || fav" :area="content.category.area" key="0">{{ content.category.name }}</Badge>
                    <h3 key="1">{{ content.name }}</h3>
                    <h4 key="2" v-if="!saved">{{ content.description }}</h4>
                    <h4 key="3" v-else-if="!remind">saved to your library</h4>
                    <div key="4" class="row" v-if="(!saved && details && !remind) || (remind && !details)" id="content-type">
                        <icon v-if="content.type" :icon="content.type" />
                        <h4 v-if="content.minutes">{{ content.minutes }} min</h4>
                        <h4 v-else-if="content.tag">{{ content.tag }}</h4>
                    </div>
                </TransitionGroup>
            </div>
        </div>
    </Transition>
</template>
  
<script>
import Image from "@/components/image.vue";
import Button from "@/components/button.vue";
import Badge from "@/components/badge.vue";

export default {
    components: {
        Button,
        Image,
        Badge
    },

    props: {
        content: Object,
        details: Boolean,
        saved: Boolean,
        fav: Boolean,
        remind: Boolean,
        due: Number
    },

    /*
    data() {
        return {
            time: null
        }
    },
    */

    emits: ['setBookmark', 'setFav'],

    computed: {
        image() {
            return "/img/content/" + this.content._id + ".png"
        },

        bookmarkIcon() {
            if (this.content && !this.content.saved) {
                return "fa-regular fa-bookmark"
            } else {
                return "bookmark"
            }
        },

        heartIcon() {
            if (this.content && this.content.fav) {
                return "heart"
            } else {
                return "fa-regular fa-heart"
            }
        }
    },

    methods: {
        startContent() {
            if (this.content.practical) {
                this.$router.push('/sip/' + this.content._id)
            } else {
                this.$router.push('/bite/' + this.content._id)
            }
        }
    },

    /*
    mounted() {
        if (this.content.time) {
            const date = DateTime.fromISO(this.content.time)
            const dayString = date.setLocale('en-US').toRelativeCalendar()

            if (dayString === "today") {
                this.time = date.toFormat('h:mm a')
            } else {
                this.time = dayString.charAt(0).toUpperCase() + dayString.substring(1)
            }
        }
    }
    */
};
</script>
  
<style lang="scss">
@use "variables" as v;

#bite-container {
    background-color: rgba(v.$text-color, 0.08);
    height: fit-content;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 0.5em;
    border-radius: 1em;
    flex-direction: row;
    width: 100%;
    gap: 0.75em;

    #image {
        width: 52%;
        aspect-ratio: 4/5;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 0.75em;
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
        margin-top: -0.325em;

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
        height: 100%;
        flex-grow: 1;
        gap: 0.75em;
        max-height: 100vh;

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