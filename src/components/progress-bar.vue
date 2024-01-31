<template>
  <div id="bar" class="row">
    <template v-if="!content || !content.practical">
      <h5>Start</h5>
    <div>
      <div :style="{ width: progress + '%' }"></div>
    </div>
    <h5 v-if="quiz" :class="{ yet: !contentDone }">Quiz</h5>
    <div v-if="quiz" :class="{ done: finished }" style="width: 0.65em;" />
    <h5 :class="{ yet: !finished || (!quiz && slideNumber-1 === currentSlide) }">Finish</h5>
    </template>
    <h5 v-else-if="content.practical">{{  content.name }}</h5>
  </div>
</template>

<script>
import Button from "./button.vue";

export default {
  props: {
    slideNumber: Number,
    currentSlide: Number,
    contentDone: Boolean,
    finished: Boolean,
    quiz: Boolean,
    content: Object
  },

  computed: {
    progress() {
      return (this.currentSlide / (this.slideNumber - 1)) * 100;
    },
  }
};
</script>

<style lang="scss">
@use "variables" as v;

#bar {
  position: fixed;
  width: calc(100% - 6*v.$viewport-padding-horizontal);
  left: calc(3*v.$viewport-padding-horizontal);
  top: 0.5em;
  height: 0.4em;
  gap: 0.25em;
  justify-content: center;

  h5 {
    color: rgba(v.$text-color, 0.4);

    &.yet {
      color: rgba(v.$text-color, 0.1);
    }
  }

  div {
    background-color: rgba(v.$text-color, 0.1);
    transition: width 0.5s;
    max-width: 100%;
    height: 100%;

    &.done {
      background-color: rgba(v.$text-color, 0.25);
    }

    >div {
      background-color: rgba(v.$text-color, 0.15);
    }
  }
}
</style>