<template>
 <p>Explore page – yet to be implemented </p>
</template>

<script>
import Button from "@/components/button.vue";
import Image from "@/components/image.vue";

export default {
  components: {
    Button,
    Image
  },

  props: {
    userData: Object,
    data: Object
  },

  data() {
    return {
      user: this.$auth0.user,
      loaded: false
    };
  },

  methods: {

  }
};
</script>

<style lang="scss">
@use "variables" as v;


</style>