<template>
  <transition name="bottom-sheet">
    <div id="bottom-sheet" v-if="open">
      <Transition name="fade">
        <div id="touch-area" v-if="persist" @touchstart="touchStartMethod">
          <div></div>
        </div>
      </Transition>
      <slot></slot>
    </div>
  </transition>
  <transition :name="'fade'">
    <Backdrop v-if="open" @click="closeSlideout" />
  </transition>
</template>

<script>
import Backdrop from "./backdrop.vue";

export default {
  components: {
    Backdrop
  },

  emits: ["close-slideout", "touchEnd"],

  props: {
    open: Boolean,
    persist: Boolean
  },

  methods: {
    touchStartMethod(touchEvent) {
      const posYStart = touchEvent.changedTouches[0].clientY;
      addEventListener('touchend', (touchEvent) => this.touchEnd(touchEvent, posYStart), { once: true });
    },

    touchEnd(touchEvent, posYStart) {
      const posYEnd = touchEvent.changedTouches[0].clientY;

      if (posYStart < (posYEnd - 25)) {
        this.$emit("close-slideout")
      }
    },

    closeSlideout() {
      if (this.persist) {
        this.$emit('close-slideout')
      }
    }
  }
};
</script>

<style lang="scss">
@use "variables" as v;

#bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: v.$content-color;
  color: v.$text-color;
  z-index: 10;
  width: 100%;
  //max-height: 50vh;
  padding: v.$viewport-padding-vertical v.$content-padding;
  border-radius: 1.5em;
  transition: all 0.4s ease-in-out;

  #touch-area {
    z-index: 20;
    pointer-events: visible;
    position: absolute;
    top: 0.4em;
    left: 50%;
    transform: translate(-50%, -25%);
    height: 10vh;
    width: 100vw;
    justify-content: center;
    align-items: center;

    >div {
      top: -25%;
      background-color: rgba(v.$text-color, 0.2);
      height: 0.25em;
      width: 3.5em;
    }
  }
}

.bottom-sheet-enter-from,
.bottom-sheet-leave-to {
  transform: translateY(100%);
}
</style>