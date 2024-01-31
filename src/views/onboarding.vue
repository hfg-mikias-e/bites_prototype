<template>
  <div>
    <div v-if="$store.state.firstTimeUse">
      <!--
      <Slides :slides="slides" :currentSlide="currentSlide"/>
      <ProgressBar :allSlides="slides.length" @nextSlide="(slide) => currentSlide = slide" @completeSection="completeOnboarding"/>-->
      <Transition name="fade">
        <ProgressBar v-if="onboardingSlides" :currentSlide="currentSlide" :slideNumber="lastSlide"
          :contentDone="!onboardingSlides" />
      </Transition>
      <Slides v-if="onboardingSlides" :content="{ _id: 'onboarding' }" :number="currentSlide + 1" @lastSlide="last => lastSlide = last"
        @currentSlide="current => currentSlide = current" @contentDone="onboardingSlides = false" />
        <div v-else>
          <h1>Welcome on board, {{ $store.state.username }}!</h1>
          <Button @click="completeOnboarding">Let's get started with {{  title }}</Button>
        </div>
    </div>
    <div v-else>
      <p>You'll be redirected...</p>
    </div>
  </div>
</template>

<script>
import Slides from '@/components/slides.vue'
import Button from '@/components/button.vue'
import ProgressBar from '@/components/progress-bar.vue';
import { title } from '@/assets/data/names.js'

export default {
  components: {
    Slides,
    Button,
    ProgressBar
  },

  data() {
    return {
      title: title,
      onboardingSlides: true,
      isAuthenticated: this.$auth0.isAuthenticated,
      currentSlide: 0,
      lastSlide: 0
    };
  },

  methods: {
    handleSignUp() {
      this.$auth0.loginWithRedirect({
        appState: {
          target: "/home", // screen after signup
        },
        authorizationParams: {
          screen_hint: "signup",
        }
      });
    },
    handleLogin() {
      this.$auth0.loginWithRedirect({
        appState: {
          target: "/home", // screen after login
        }
      });
    },
    async completeOnboarding() {
      await this.$store.dispatch('setOnboarding', false)
      this.handleSignUp()
    }
  },

  created() {
    if (this.isAuthenticated) {
      this.$router.push('/home')
    } else if (!this.$store.state.firstTimeUse) {
      this.handleLogin()
    }
  }
};
</script>