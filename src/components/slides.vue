<template>
  <transition :name="direction ? 'slide-fade' : 'slide-fade-reverse'">
    <div v-if="!transition" id="slide" @touchstart="touchStartMethod" :class="{card: $route.name === 'Content'}">
      <component :is="component" @contentDone="$emit('contentDone')" @stars="stars"/>
      <Transition name="fade">
        <div id="note"
          v-if="currentSlide === 0 && $route.name === 'Content' && !content.practical && content.type === 'book'">
          <h2>swipe to<br />continue!</h2>
          <Image src="/img/accents/arrow.png" />
        </div>
      </Transition>
    </div>
  </transition>
</template>

<script>
import { defineAsyncComponent, markRaw } from 'vue'
import Image from '@/components/image.vue';

export default {
  components: {
    Image
  },

  props: {
    content: Object,
    contentID: [ String, Number ],
    number: Number
  },

  emits: ["lastSlide", "currentSlide", "contentDone", "stars"],

  data() {
    return {
      direction: false,
      transition: false,
      component: null,
      currentSlide: 0,
      lastSlide: 0
    };
  },

  watch: {
    async number(newNum, oldNum) {

      if (newNum > oldNum) {
        this.direction = true
      } else {
        this.direction = false
      }

      this.transition = true;
      setTimeout(() => {
        this.transition = false;
      }, 300);

      this.component = this.returnComponent()
    },
  },

  methods: {
    returnComponent() {
      const comp = defineAsyncComponent(() => import(`@/components/content/${this.contentID + "/" + this.number}.vue`))
      console.log(comp)
      return markRaw(comp)
    },

    touchStartMethod(touchEvent) {
      const posXStart = touchEvent.changedTouches[0].clientX;
      addEventListener('touchend', (touchEvent) => this.touchEnd(touchEvent, posXStart), { once: true });
    },

    touchEnd(touchEvent, posXStart) {
      const posXEnd = touchEvent.changedTouches[0].clientX;

      console.log(posXStart, posXEnd)
      if (posXStart < (posXEnd - 25) && this.currentSlide > 0) {
        this.currentSlide = this.currentSlide - 1
      } else if (posXStart > (posXEnd + 25) && this.currentSlide < this.lastSlide - 1) {
        this.currentSlide = this.currentSlide + 1
      }

      this.$emit("currentSlide", this.currentSlide)
    },

    stars(val) {
      console.log(val)
      this.$emit("stars", val)
    }
  },

  async created() {
    let last = false
    while (!last) {
      await import(`@/components/content/${this.contentID}/${this.lastSlide + 1}.vue`).then((_res) => {
        console.log("add")
        this.lastSlide = this.lastSlide + 1
      }).catch(() => {
        last = true
      })
    }

    console.log("lastSlide: " + this.lastSlide)
    this.$emit("lastSlide", this.lastSlide)

    //await this.checkForLast()
    this.component = this.returnComponent()
  }
}
</script>

<style lang="scss">
@use "variables" as v;

#slide {
  padding: 0.5em;
  gap: v.$content-gap;

  &.card {
    align-items: center;
    overflow: hidden;
    padding: 20% 1.5em;
    background-color: v.$content-color;
    border-radius: 2.5em;
    position: fixed;
    top: 2em;
    left: 0.5em;
    width: calc(100vw - 1em);
    height: calc(100% - 3.75em);
  }

  video,
  iframe {
    background: none;
  }

  p,
  b {
    font-size: 1.125em;
    line-height: 140%;
  }

  img {
    max-width: 50vw;
    margin: 0 auto;
  }

  #note {
    bottom: 2em;
    right: 2em;
    align-items: flex-end;
    opacity: 0.6;

    h2 {
      left: -1em;
      bottom: -0.2em;
    }

    img {
      width: 1.5em;
      transform: scaleY(-1) rotate(40deg);
    }
  }

  #slideBackground {
    position: absolute;
    background-color: white;
    align-items: center;
    height: 100%;
    left: 0;
    top: 0;
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active,
.slide-fade-reverse-enter-active,
.slide-fade-reverse-leave-active {
  transition: all 0.2s ease-out;
}

.slide-fade-enter-from,
.slide-fade-reverse-leave-to {
  transform: translateX(100%);
}

.slide-fade-leave-to,
.slide-fade-reverse-enter-from {
  transform: translateX(-100%);
}</style>