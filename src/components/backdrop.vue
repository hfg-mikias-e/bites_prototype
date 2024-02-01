<template>
  <transition name="fade">
    <div id="backdrop">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    area: String
  },

  created() {
    document.querySelector('meta[name="theme-color"]').setAttribute("content", "#070609")
  },

  async beforeUnmount() {
    await document.querySelector('meta[name="theme-color"]').setAttribute("content", "#1C1725")
  }
}
</script>

<style lang="scss">
@use "variables" as v;

#backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
  border-radius: 0;
  background-color: rgba(#000, 0.75);
}
</style>