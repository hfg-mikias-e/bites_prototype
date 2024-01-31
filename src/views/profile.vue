<template>
  <div id="profile">
    <h1>Profil</h1>
    <div>
      <h2>{{ userData.name }}</h2>
      <p>{{ user.email }}</p>
    </div>
    <Button @click="handleLogout">Log Out</Button>
  </div>
</template>

<script>
import Image from "@/components/image.vue";
import Button from "@/components/button.vue";
import Slides from "@/components/slides.vue";

export default {
  components: {
    Image,
    Button,
    Slides
  },

  props: {
    userData: Object
  },

  data() {
    return {
      user: this.$auth0.user,
    };
  },

  methods: {
    async handleLogout() {
      await this.$OneSignal.logout(this.user.sub)
      this.$auth0.logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    }
  }
};
</script>

<style lang="scss">
@use "variables" as v;

#profile {
  gap: v.$content-gap;
}
</style>