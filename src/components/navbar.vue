<template>
  <Transition name="fade">
    <div id="shadow" v-show="!disabled">
      <div id="navbar" class="row">
        <Button :icon="'house'">
          <p>Home</p>
        </Button>
        <Button :icon="'cookie-bite'">
          <p>Bites</p>
        </Button>
        <Button :icon="'magnifying-glass'">
          <p>Explore</p>
        </Button>
        <Button :icon="'user'">
          <p>Profile</p>
        </Button>
      </div>
    </div>
  </Transition>
</template>

<script>
import Button from "./button.vue";

export default {
  components: {
    Button,
  },

  props: {
    disabled: Boolean
  },

  methods: {
    redirect(route) {
      this.$router.push(`/${route}`);
    },
  },
};
</script>

<style lang="scss">
@use "variables" as v;

#shadow {
  position: absolute;
  border-radius: 0;
  bottom: 0;
  left: 0;
  padding: calc(0.75*v.$viewport-padding-vertical) calc(2*v.$viewport-padding-horizontal);
  background: linear-gradient(0deg, v.$background-color 10%, rgba(v.$background-color, 0) 100%);
  z-index: 8;
}

#navbar {
  width: 100%;
  padding: 0.5em;
  width: 100%;
  border-radius: 5em;
  background-color: rgba(v.$text-color, 0.1);
  backdrop-filter: blur(20px);
  color: v.$text-color;

  button {
    border: none;
    text-decoration: none;
    display: flex;
    font-size: 1em;
    border-radius: 100vw;
    color: v.$text-color;
    background: none; //v.$background-color;
    padding: 0;
    flex-grow: 1;
    gap: 0;
    height: 4em;
    min-width: 4em;

    p {
      font-size: 0px;
    }

    svg,
    path {
      transition: all 0.1s;
      font-size: 1.5em;
    }

    &:first-of-type {
      flex-grow: 1;
      overflow: hidden;
      color: v.$text-color;
      background-color: rgba(v.$background-color, 0.5);
      gap: 0.5em;

      p {
        font-size: 1em;
        font-weight: bold;
      }
    }
  }
}
</style>