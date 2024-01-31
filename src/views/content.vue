<template>
  <div v-if="content">
    <Transition name="fade">
      <div id="infoCard" v-if="!started" :class="{ bite: !content.practical }">
        <template v-if="!content.practical">
          <Button icon="xmark" @click="$router.go(-1)" class="transparent no-text"/>
          <div>
            <h1>This is a Bite!</h1>
            <h2>In the following <span v-if="content.type === 'book'">slides</span><span v-else-if="content.type === 'film'">video</span> of this Bite, you will learn about the theory and basics of this skill.</h2>
          </div>
          <div id="image">
            <Image src="/img/bite.svg" />
          </div>
        </template>
        <template v-else>
          <div>
            <Button icon="xmark" @click="$router.go(-1)" class="transparent no-text"/>
            <h1>{{ content.name }}</h1>
          </div>
          <div>
            <h2>Effects</h2>
            <h3>{{ content.effect }}</h3>
          </div>
          <div>
            <h2>How it works</h2>
            <div id="effect">
              <component v-if="component" :is="component" />
            </div>
          </div>
        </template>
        <Button class="ready" v-if="content.practical" @click="start">Okay, ready!</Button>
        <Button class="ready" v-else @click="start">Understood!</Button>
      </div>
    </Transition>

    <Transition name="fade">
      <ProgressBar :currentSlide="currentSlide" :slideNumber="lastSlide" :contentDone="contentDone"
        :finished="finished" :quiz="content.quiz !== undefined" :content="content" />
    </Transition>

    <Slides v-if="!contentDone" :content="content" :number="currentSlide + 1"
      @lastSlide="last => lastSlide = last" @currentSlide="current => currentSlide = current"
      @contentDone="completeContent" />

    <Transition name="fade">
      <Quiz v-if="contentDone && content.quiz" :questions="content.quiz" @quizDone="completeBite"
        @finished="fin => finished = fin" />
    </Transition>
  </div>
</template>

<script>
import axios from 'axios'
import Slides from '@/components/slides.vue'
import Quiz from '@/components/quiz.vue'
import ProgressBar from '@/components/progress-bar.vue'
import BiteCard from '@/components/bite-card.vue'
import Button from '@/components/button.vue'
import Image from '@/components/image.vue'
import { content } from '@/assets/data/content.js'
import { defineAsyncComponent, markRaw } from 'vue'

export default {
  components: {
    Slides,
    Quiz,
    ProgressBar,
    Button,
    BiteCard,
    Image
  },

  emits: ['showNavbar', 'stars'],

  data() {
    return {
      content: null,

      component: null,
      contentDone: false,
      currentSlide: 0,
      lastSlide: 0,

      finished: false,
      started: false
    }
  },

  computed: {
    contentID() {
      return Number(this.$route.params.content)
    }
  },

  methods: {
    returnComponent() {
      const comp = defineAsyncComponent(() => import(`@/components/content/${this.content._id}/0.vue`))
      return markRaw(comp)
    },

    /*
    async completeBite() {
      await axios.post(process.env.VUE_APP_API_SERVER_URL + "/changeBiteState", { userId: this.user.sub, state: 'done', biteId: this.content._id }).then(async (response) => {
        this.$router.push('/done/' + this.content._id)
      }).catch((error) => {
        console.error(error)
      })
    },
    */

    completeContent() {
      this.contentDone = true

      if (!this.content.quiz) {
        this.finished = true
        /*
        setTimeout(() => {
          this.completeBite()
        }, 200)
        */
      }
    },

    async start() {
      await document.querySelector('meta[name="theme-color"]').setAttribute("content", "#1C1725")
      this.started = true
    },

    touchStartMethod(touchEvent) {
      const posXStart = touchEvent.changedTouches[0].clientX;
      addEventListener('touchend', (touchEvent) => this.touchEnd(touchEvent, posXStart), { once: true });
    },

    touchEnd(touchEvent, posXStart) {
      const posXEnd = touchEvent.changedTouches[0].clientX;
      if (posXStart < (posXEnd - 25) && this.currentSlide > 0) {
        this.currentSlide = this.currentSlide - 1
      } else if (posXStart > (posXEnd + 25) && this.currentSlide < this.lastSlide - 1) {
        this.currentSlide = this.currentSlide + 1
      }
    },
  },

  async created() {
    this.content = this.data.content[this.contentID]

    this.$emit('showNavbar', false)
    document.querySelector('meta[name="theme-color"]').setAttribute("content", "#D3CAFA")

    if (this.content.practical) {
      this.component = this.returnComponent()
    }
  },

  async beforeUnmount() {
    await document.querySelector('meta[name="theme-color"]').setAttribute("content", "#1C1725")
    this.$emit('showNavbar', true)
  }
};
</script>

<style lang="scss">
@use "variables" as v;

#infoCard {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100%;
  border-radius: 0;
  background-color: v.$primary-color;
  color: v.$background-color;
  padding: calc(2* v.$viewport-padding-horizontal);
  //padding-top: calc(2* v.$viewport-padding-vertical);
  z-index: 1;
  justify-content: space-between;

  h2 {
    font-weight: bold;
  }

  >div {
    gap: calc(0.5*v.$content-gap);

    &:first-of-type {
      gap: v.$content-gap;
    }
  }

  &.bite {
    gap: calc(1.5* v.$viewport-padding-vertical);
  }

  img {
    background: none;
  }

  button {
    background: none;
    background-color: rgba(v.$background-color, 0.1);
    color: v.$background-color;
    height: 2.5em;
    width: 2.5em;

    svg {
      height: 1.25em,
    }

    &.ready {
      color: v.$text-color;
      height: 3.2em;
      background-color: v.$background-color;
      width: 100%;
    }
  }

  #image {
    flex-grow: 1;
    justify-content: center;
  }
}

#effect {
  gap: 1.75em;

  >div {
    gap: 1.5em;

    .row {
      gap: 0.25em;
    }
  }

  >ul {
    gap: 0.125em;
  }
}
</style>