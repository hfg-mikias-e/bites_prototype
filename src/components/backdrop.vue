<template>
  <transition name="fade">
    <div id="backdrop">
      <slot></slot>
    </div>
  </transition>
</template>

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