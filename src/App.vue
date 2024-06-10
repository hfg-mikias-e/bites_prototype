<template>
  <TransitionGroup name="fade" mode="out-in">
    <div id="route" :style="{ paddingTop: $route.name === 'Content' ? 0 : 'unset' }"
      :class="{ navbar: showNavbar, space: stars }" v-if="!$store.state.firstTimeUse">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.name" @showNavbar="val => showNavbar = val"
            @stars="star => stars = star" @resetPrototype="onboardingSlides = true" />
        </transition>
      </router-view>
    </div>
    <div id="onboarding" :class="{ space: stars }" v-else>
      <Transition name="fade">
        <ProgressBar v-if="onboardingSlides" :currentSlide="currentSlide" :slideNumber="lastSlide"
          :contentDone="!onboardingSlides" />
      </Transition>
      <Slides v-if="onboardingSlides" contentID="onboarding" :number="currentSlide + 1"
        @lastSlide="last => lastSlide = last" @currentSlide="current => currentSlide = current"
        @contentDone="onboardingSlides = false" @stars="star => stars = star" @colors="color => colors = color" />
      <div id="welcome" v-else>
        <h1>Welcome on board, {{ $store.state.username }}!</h1>
        <Button class="primary" @click="completeOnboarding">Let's get started!</Button>
      </div>

      <SlideOut :open="prompt !== null || !standaloneMode" :persist="true"
        @close-slideout="prompt = null, standaloneMode = true">
        <div id="info">
          <h3>Install and access this App directly from the Home screen of your phone for the best experience, such as
            receiving Notifications for your saved content!</h3>
          <Button v-if="installPossible" class="primary" @click="install">Install Bites</Button>
          <template v-else>
            <div class="row">
              <p>1. Tap the <span class="action">share option</span> (
                <Image src="/img/share-icon.png" />) in your browser and select <span class="action">"Add to Home
                  Screen"</span>!
              </p>
            </div>
            <p>2. Open {{ title }} over your freshly installed App!</p>
          </template>
        </div>
      </SlideOut>
    </div>
  </TransitionGroup>

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
        <p>Please be aware that receiving push notifications on your mobile device might not take effect until you
          restart
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
  import axios from 'axios';

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
        prompt: null,
        installPossible: false,
        standaloneMode: true,

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

      async install() {
        if (this.promt !== null) {
          this.prompt.prompt();
        }
      },

      subscribeUser() {
        this.$OneSignal.User.PushSubscription.optIn().then(async () => {
          this.permission = Notification.permission
          await this.$store.dispatch("setID", this.$OneSignal.User.PushSubscription.id)
          this.$OneSignal.login(this.$store.state.accountID)
        });
      },
      setSubscription(subscribed) {
        this.$store.dispatch("setSubscription", subscribed);
      },

      pingServer() {
        axios.get(process.env.VUE_APP_API_SERVER_URL + "/").then((response) => {
          console.log("ping server: " + response.data)
        })
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
      window.addEventListener("beforeinstallprompt", e => {
        e.preventDefault();
        // Stash the event so it can be triggered later.
        this.prompt = e
        this.installPossible = true
      })

      window.addEventListener("appinstalled", () => {
        this.prompt = null
      })

      if (!this.installPossible) {
        this.standaloneMode = ('standalone' in window.navigator) && window.navigator.standalone
      }

      // backend heartbeat
      this.pingServer()
      setInterval(() => {
        this.pingServer()
      }, 600000)
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
    overflow: scroll;
    overflow-x: hidden;
    border-radius: 0;

    &.space {
      background-image: url('../public/img/stars.png');
      background-repeat: no-repeat;
      background-position: 50% 0;
      background-size: cover;
    }

    >div:not(#bar) {
      flex-grow: 1;
    }
  }

  #info {
    gap: 1em;
    padding: 1em 0;

    span.action {
      color: rgb(64, 156, 255);
    }

    img {
      background: none;
      width: 1.5em;
      transform: translateY(25%);
    }
  }

  #onboarding {
    padding: v.$viewport-padding-vertical v.$viewport-padding-horizontal;
    height: 100%;

    #slide {
      height: 100%;
    }

    #welcome {
      gap: v.$content-gap;
      align-items: center;

      button {
        width: 100%;
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