<template>
  <Transition name="fade">
    <div id="route" :class="{ navbar: showNavbar, space: stars }" v-if="!$store.state.firstTimeUse">
      <router-view v-slot="{ Component, route }" mode="out-in">
        <transition name="fade">
          <component :is="Component" :key="route.name" @showNavbar="val => showNavbar = val" @stars="star => stars = star" />
        </transition>
      </router-view>
      <Transition name="fade" appear>
        <Navbar :disabled="!showNavbar" />
      </Transition>
    </div>
  </Transition>

  <Transition name="fade">
    <div id="route" v-if="$store.state.firstTimeUse">
      <Transition name="fade">
        <ProgressBar v-if="onboardingSlides" :currentSlide="currentSlide" :slideNumber="lastSlide"
          :contentDone="!onboardingSlides" />
      </Transition>
      <Slides v-if="onboardingSlides" :content="{ _id: 'onboarding' }" :number="currentSlide + 1"
        @lastSlide="last => lastSlide = last" @currentSlide="current => currentSlide = current"
        @contentDone="onboardingSlides = false" />
      <div v-else>
        <h1>Welcome on board, {{ $store.state.username }}!</h1>
        <Button class="primary complete" @click="completeOnboarding">Let's get started!</Button>
      </div>

      <SlideOut :open="prompt" :persist="true" @close-slideout="prompt = false">
        <div id="info">
          <h3>Install and access this App directly from the Home screen of your phone for the best experience!</h3>
          <div class="row">
            <p>1. Tap on</p>
            <div id="action">
              <Image src="/img/share-icon.png" />
            </div>
          </div>
          <div class="row">
            <p>2. Select</p>
            <div id="action">Add to Home Screen</div>
          </div>
          <p>3. Open {{ title }} over your freshly installed App!</p>
        </div>
      </SlideOut>
    </div>
  </Transition>

  <!-- Not subscribed -->
  <SlideOut :open="!$store.state.subscribed && !onboardingSlides">
    <div id="startBite">
      <template v-if="permission === 'default'">
        <h2>Just one more thing!</h2>
        <p>If you allow {{ title }} to send you Push-Notifications, you will always be reminded of your Bites and Sips
          that you saved for a later time.</p>
      </template>
      <template v-if="permission === 'granted'">
        <h2>You've allowed Push-Notifications!</h2>
        <p>Please be aware that receiving push notifications on your mobile device might not take effect until you restart
          the app.</p>
      </template>
      <template v-if="permission === 'denied'">
        <h2>You've declined Push-Notifications.</h2>
        <p>If you would like to change this, you can do so any time inside the
          notification settings of your mobile device.</p>
      </template>
      <Button class="primary" @click="subscribeUser" v-if="permission === 'default'">
        Set permission
      </Button>
      <Button @click="setSubscription(true)" v-else>Got it!</Button>
    </div>
  </SlideOut>
</template>

<script>
import Navbar from '@/components/navbar.vue'
import Slides from '@/components/slides.vue'
import Button from '@/components/button.vue'
import Image from '@/components/image.vue'
import ProgressBar from '@/components/progress-bar.vue';
import SlideOut from '@/components/slide-out.vue'
import { title } from '@/assets/data/names.js'

export default {
  name: 'App',

  components: {
    ProgressBar,
    Slides,
    Navbar,
    Button,
    SlideOut,
    Image
  },

  data() {
    return {
      title: title,
      permission: "default",
      prompt: false,

      stars: false,
      showNavbar: false,

      onboardingSlides: true,
      currentSlide: 0,
      lastSlide: 0
    };
  },

  computed: {
    isAuthenticated() {
      return this.$store.state.username !== ""
    }
  },

  methods: {
    async completeOnboarding() {
      await this.$store.dispatch('setOnboarding', false)
    },

    subscribeUser() {
      this.$OneSignal.User.PushSubscription.optIn().then(async() => {
        this.permission = Notification.permission
        await this.$store.dispatch("setID", this.$OneSignal.User.PushSubscription.id)
        this.$OneSignal.login(this.$store.state.accountID)
      });
    },
    setSubscription(subscribed) {
      this.$store.dispatch("setSubscription", subscribed);
    }
  },

  watch: {
    async $route() {
      if (this.$route.name !== "Onboarding") {
        this.showNavbar = true
      }
    }
  },

  mounted() {
    setTimeout(() => {
      this.prompt = true
    }, 500)
  },
}
</script>

<style lang="scss">
@use "variables" as v;
@import "./style.scss";

#route {
  width: 100%;
  height: 100%;
  flex-grow: 1;
  padding: v.$viewport-padding-vertical v.$viewport-padding-horizontal;
  overflow: scroll;
  overflow-x: hidden;
  border-radius: 0;

  &.navbar {
    padding-bottom: calc(v.$navbar-height + v.$viewport-padding-vertical + v.$content-gap);
  }

  &.space {
    background-image: url('../public/img/stars.png');
    background-repeat: no-repeat;
    background-position: 50% 0;
    background-size: cover;
  }

  >div {
    flex-grow: 1;
  }

  #info {
    gap: 1em;
    padding: 1em 0;

    h3 {
      margin-bottom: 1em;
    }

    p {
      font-weight: 500;
    }

    #action {
      padding: 0.25em 0.5em;
      background-color: rgba(v.$text-color, 0.2);
      border-radius: 0.5em;
      width: fit-content;
      font-weight: 500;
    }

    .row {
      gap: 0.75em;
    }

    img {
      background: none;
      width: 1.5em;
    }
  }
}

#startBite {
  button {
    width: 100%;
  }
}

.prompt-enter-from,
.prompt-leave-to {
  transform: translateY(100%);
}

.prompt-enter-active,
.prompt-leave-active {
  transition-property: transform;
  transition-duration: 0.2s;
}

.prompt-enter-active {
  transition-delay: 0.2s;
}
</style>