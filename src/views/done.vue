<template>
  <div id="done" v-if="content">
    <template v-if="!done">
      <Transition name="fade">
        <h2 v-if="time === animationDone && !evaluation">Congrats for completing your
          <span id="accent">tantalizing</span> <span v-if="content.practical">Sip</span><span v-else>Bite</span>
          of the day
          <span id="accent">
            <Image src="/img/accents/sparkle.png" />
          </span>
        </h2>
      </Transition>
      <Transition name="fade">
        <h2 v-if="!mystery && returnFollowUp() !== undefined && liked">You've <span id="accent">unlocked</span> a Sip!
        </h2>
        <h2 v-else></h2>
      </Transition>

      <Transition name="fade">
        <div id="note" v-if="time === animationDone && !evaluation">
          <h4>yummy</h4>
          <Image src="/img/accents/scribble.png" />
        </div>
      </Transition>

      <TransitionGroup name="fade">
        <div id="doneImage" v-for="state in animationDone" :key="state" v-if="!evaluation">
          <Transition name="done">
            <img :src="'/img/done/bite-done-' + state + '.png'" v-if="time === state && !content.practical" />
          </Transition>
          <Transition name="done">
            <img :src="'/img/done/sip-done-' + state + '.png'" v-if="time === state && content.practical" />
          </Transition>
        </div>
      </TransitionGroup>


      <TransitionGroup name="fade">
        <div id="followUpImage" v-if="evaluation && returnFollowUp() !== undefined && time > 1">
          <Transition name="fade">
            <h1 v-if="mystery">?</h1>
          </Transition>
          <img :class="{ blur: mystery }" src="/img/done/sip-done-1.png" />
        </div>

        <div v-if="time === animationDone && !evaluation">
          <Transition name="fade">
            <div id="note" v-if="!$store.state.faved.includes(contentID)">
              <h4>add it to<br />your favorites!</h4>
              <Image src="/img/accents/arrow.png" />
            </div>
          </Transition>

          <h3>How did you like this <span v-if="content.practical">Sip</span><span v-else>Bite</span>?</h3>
          <BiteCard :content="content" :fav="true" @setFav="favorite" />
          <div class="row actionButtons">
            <Button class="secondary" @click="evaluation = true, liked = false">Not much...</Button>
            <Button class="primary" @click="evaluation = true, liked = true">It was neat!</Button>
          </div>
        </div>

        <div v-if="evaluation" id="bottomBox">
          <div id="dialog">
            <TransitionGroup name="list">
              <h1 :style="{ opacity: (1 - 0.4 * (time - 1)) }" v-if="liked">Good to know, we will recommend you more <span
                  v-if="content.practical">Sips</span><span v-else>Bites</span>
                like this one!</h1>
              <h1 :style="{ opacity: (1 - 0.4 * (time - 1)) }" v-else>That's unfortunate... we'll try to show more
                suitable
                <span v-if="content.practical">Sips</span><span v-else>Bites</span> for you in
                the future!
              </h1>
              <h1 :style="{ opacity: (1 - 0.4 * (time - 2)) }" v-if="time > 1">But wait....</h1>
              <h1 :style="{ opacity: (1 - 0.4 * (time - 3)) }" v-if="time > 2">there is more to explore!</h1>
              <BiteCard :details="true" :content="returnFollowUp()" v-if="time > 3"/>
            </TransitionGroup>
          </div>
          <div class="row actionButtons" v-if="time === animationDone">
            <!--<Button class="primary" @click="$router.push('/home')">Back to Home</Button>-->
            <template v-if="liked && returnFollowUp() !== undefined">
              <Button class="secondary" @click="later = true" icon="fa-regular fa-bookmark">Later</Button>
              <Button class="primary" @click="$router.push('/content/' + data.indexOf(returnFollowUp()))">Jump right
                in!</Button>
            </template>
            <Button v-else @click="$router.push('/')" class="primary">Take me back to Home</Button>
          </div>
        </div>
      </TransitionGroup>

      <SlideOut :open="later" :persist="true" ref="slideout" @close-slideout="later = false">
        <div id="startBite" v-if="returnFollowUp() !== undefined">
          <h2>Set a reminder for this Sip</h2>

          <BiteCard :details="true" :saved="true" :content="returnFollowUp() "/>
          <Notifier @notificationDate="time => setTime(time)" :show="true" />

          <div class="row actionButtons">
            <Button class="secondary" @click="closeContent">Skip</Button>
            <Button class="primary" icon="fa-regular fa-bell" @click="createPushNotification">Remind
              me</Button> <!--:disabled="future >= 0"-->
          </div>
        </div>
      </SlideOut>
    </template>

    <template v-else>
      Good work, you're all done here!
      (+1 cookie)
      <Button @click="$router.push('/')">Take me back to Home</Button>
    </template>
  </div>
</template>

<script>
import Image from '@/components/image.vue'
import Button from '@/components/button.vue'
import Badge from '@/components/badge.vue'
import BiteCard from '@/components/bite-card.vue'
import SlideOut from '@/components/slide-out.vue'
import Notifier from '@/components/notifier.vue'
import { content, categories } from '@/assets/data/content.js'
import axios from 'axios';
import { DateTime } from 'luxon'

export default {
  components: {
    Image,
    BiteCard,
    SlideOut,
    Notifier,
    Button,
    Badge
  },

  emits: ['showNavbar', 'stars'],

  data() {
    return {
      time: 1,
      animationDone: 5,
      content: null,
      evaluation: false,
      mystery: true,
      liked: true,
      later: false,
      future: null,
      notificationDate: null,
      done: false,
      data: content,
      areas: categories
    };
  },

  computed: {
    contentID() {
      return Number(this.$route.params.content)
    }
  },

  methods: {
    async closeContent() {
      this.done = true
    },

    async favorite() {
      if (this.$store.state.faved.includes(this.contentID)) {
        this.$store.dispatch("removeState", { content: this.contentID, state: "faved" })
      } else {
        this.$store.dispatch("addState", { content: this.contentID, state: "faved" })
      }
    },

    returnTimeString(timeString) {
      const date = DateTime.fromISO(timeString)
      return { day: date.setLocale('en-US').toRelativeCalendar(), time: date.toFormat('h:mm a') }
    },

    setTimer(secs) {
      this.time = 1
      const timer = setInterval(() => {
        if (this.time < this.animationDone) {
          this.time = this.time + 1
        } else {
          clearInterval(timer)
        }
      }, secs);
    },

    async createPushNotification() {
      const notifString = await this.returnTimeString(this.notificationDate)
      await axios.post(process.env.VUE_APP_API_SERVER_URL + "/showMessage", { external_id: this.$store.state.accountID, message: `Reminder successfully set for ${notifString.day} at ${notifString.time}!` })
      await axios.post(process.env.VUE_APP_API_SERVER_URL + "/createNotification", { external_id: this.$store.state.accountID, content: { id: this.data.indexOf(this.returnFollowUp()), ...this.returnFollowUp() }, date: this.notificationDate }).then(async (response) => {
        const oldNotif = this.$store.state.notifs.find(index => index.content === response.data.content)
        if (oldNotif !== undefined) {
          await axios.post(process.env.VUE_APP_API_SERVER_URL + "/cancelNotification", { oldNotif: oldNotif.id })
        }

        await this.$store.dispatch("setNotification", response.data)
        this.closeContent()
      })
    },

    setTime(time) {
      this.notificationDate = time[0]
      this.future = time[1]
    },

    returnFollowUp() {
      return this.data.find(index => index.locked_by === this.contentID)
    }
  },

  watch: {
    evaluation(value) {
      if (value) {
        if (this.liked && this.returnFollowUp() !== undefined) {
          this.animationDone = this.animationDone - 1
        } else {
          this.animationDone = 1
        }
        this.setTimer(3000)
      }
    },

    later(forLater) {
      if(forLater) {
        this.$store.dispatch("addState", { content: this.data.indexOf(this.returnFollowUp()), state: "saved" })
      } else {
        this.$store.dispatch("removeState", { content: this.data.indexOf(this.returnFollowUp()), state: "saved" })
      }
    },

    time(time) {
      if (this.evaluation && time === this.animationDone) {
        this.mystery = false
      }
    }
  },

  created() {
    this.content = this.data[this.contentID]

    this.$emit('showNavbar', false)
    this.$emit("stars", true)
    this.setTimer(800)
  },

  beforeUnmount() {
    this.$emit("stars", false)
    this.$emit('showNavbar', true)
  }
}
</script>

<style lang="scss">
@use "variables" as v;

#done {
  padding: v.$viewport-padding-vertical v.$viewport-padding-horizontal;
  height: 100%;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 1.5em;
  }

  >#note {
    gap: 0;
    top: calc(15% + 5%);
    right: 30%;

    img {
      transform: rotate(2deg);
    }

    h4 {
      transform: rotate(12deg);
    }
  }

  >div {
    gap: 1.5em;

    #note {
      gap: 0.25em;
      right: 1.75%;
      top: 5%;

      img {
        transform: scaleY(-1) rotate(2deg);
      }

      h4 {
        transform: rotate(-8.555deg);
      }
    }
  }

  .actionButtons {
    gap: 0.5em;

    button {
      flex-grow: 1;
    }
  }
}

h2 {
  #accent {
    color: v.$primary-color;

    >img {
      background: none;
      width: 1.25em;
      position: absolute;
      transform: translate(28%);
    }
  }
}

#doneImage,
#followUpImage {
  position: absolute;
  top: 15%;
  width: 75%;

  img {
    background: none;

    &.blur {
      filter: blur(1em);
    }
  }

  h1 {
    position: absolute;
    font-size: 8em;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: v.$background-color;
    z-index: 1;
  }
}

#bottomBox {
  position: absolute;
  bottom: 0;
  padding: v.$viewport-padding-vertical v.$viewport-padding-horizontal;

  #dialog {
    position: absolute;
    bottom: calc(v.$viewport-padding-vertical + 5.5em);
    gap: 0.5em;
    width: calc(100% - 2*v.$viewport-padding-horizontal);
  }

  #bite-container {
    margin-top: 0.5em;
  }
}
</style>