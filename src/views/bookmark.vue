<template>
  <div>
    <h1>Hier sind dann Deine Bites etc.</h1>
    <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
      magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
      gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing
      elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero
      eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
      dolor sit amet.</p>
  </div>
</template>
  
<script>
export default {
  props: {
    userData: Object
  },

  watch: {
    async userData() {
      console.log('hier alle Objekte in "done" abrufen')
    }
  },

  data() {
    return {
      user: this.$auth0.user,
    };
  }
};
</script>