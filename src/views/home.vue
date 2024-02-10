<template>
  <div id="home">
    <div class="row">
      <h1 @click="resetPrototype()">Hey, {{ $store.state.username }}!<br />Here are some helpful skills
        <span id="accent">for you
          <Image src="/img/accents/show.png" />
        </span>
      </h1>
      <Button icon="fa-regular fa-bell" class="icon" />
    </div>

    <div>
      <BiteCard :static="true" v-for="skill in data.filter(index => index.locked_by === undefined)" :key="skill"
        :content="skill" @click="openContent(skill, false)" @setBookmark="checkForSave(skill)" />
    </div>

    <div id="demo">
      <h4>This application is a demo and contains a small selection of sample content. It also includes the ability to
        save and receive reminders.</h4>
    </div>

    <SlideOut :open="currentContent !== null" :persist="!saveState" ref="slideout" @close-slideout="closeContent">
      <div id="startBite" v-if="currentContent">
        <h2 v-if="saveState">Want to add a reminder?</h2>
        <template v-else>
          <h2 v-if="!currentContent.practical">Start this Bite?</h2>
          <h2 v-else>Start this Sip?</h2>
        </template>

        <Transition name="fade">
          <div id="note" v-show="!saveState && !$store.state.saved.includes(data.indexOf(currentContent))">
            <h4>bad timing?</h4>
            <Image src="/img/accents/arrow.png" />
          </div>
        </Transition>

        <BiteCard :details="true" :saved="saveState" :content="currentContent"
          @setBookmark="checkForSave(currentContent)" />

        <div id="follow-up" v-if="returnFollowUp()" :class="{ hidden: saveState }">
          <h4>Unlocks the following Sip:</h4>
          <div id="bite-container" class="row follow-up">
            <div id="image" :style="{ backgroundImage: 'url(/img/content/' + data.indexOf(currentContent) + '.png)' }">
              <icon icon="lock" />
              <div />
            </div>
            <h4>{{ returnFollowUp().name }}</h4>
            <Image src="/img/sip.svg" />
          </div>
        </div>

        <Notifier @notificationDate="time => setTime(time)" :show="saveState" />

        <div class="row" id="actionButtons">
          <Button class="primary" v-if="!saveState" @click="$router.push('/content/' + data.indexOf(currentContent))">
            <Image v-if="currentContent.practical" src="/img/sip.svg" />
            <Image v-else src="/img/bite.svg" />Start it!
          </Button>
          <template v-else>
            <Button class="secondary" @click="closeContent">Skip</Button>
            <Button class="primary" @click="createPushNotification">Set Reminder</Button> <!--:disabled="future >= 0"-->
          </template>
        </div>
      </div>
    </SlideOut>
  </div>
</template>

<script>
import BiteCard from "@/components/bite-card.vue"
import SlideOut from "@/components/slide-out.vue"
import Notifier from "@/components/notifier.vue"
import Image from "@/components/image.vue"
import Button from "@/components/button.vue"
import axios from 'axios'
import { content } from '@/assets/data/content.js'
import { DateTime } from 'luxon'

export default {
  components: {
    SlideOut,
    Notifier,
    BiteCard,
    Image,
    Button
  },

  emits: ["showNavbar"],

  data() {
    return {
      messageData: null,
      currentContent: null,
      saveState: false,
      future: null,
      notificationDate: null,
      currentTime: null,
      data: content
    }
  },

  methods: {
    async resetPrototype() {
      await this.$store.dispatch('setOnboarding', true)
      console.log("hello")
    },

    randomNumber(min, max) {
      return Math.random() * (max - min) + min
    },

    setTime(time) {
      console.log("setTime")
      this.notificationDate = time[0]
      this.future = time[1]
    },

    /*
    setContent(content) {
      if (this.$store.state.active) {
        const isSaved = this.$store.state.active.some(index => index === content._id)

        if (isSaved) {
          if (this.$store.state.notifs) {
            const isTimed = this.$store.state.notifs.some(index => index.content === content._id)

            if (isTimed) {
              return {
                ...content,
                category: this.data.categories.find(index => index._id === content.category),
                saved: isSaved,
                time: this.returnShownDate(this.$store.state.notifs.find(index => index.content === content._id).date)
              }
            }
          }
        }
      }
      return {
        ...content,
        category: this.data.categories.find(index => index._id === content.category),
        saved: false
      }
    },
    */

    openContent(content, bookmark) {
      // don't open Slideout if already bookmarked (when bookmark clicked)
      if (!bookmark || (bookmark && !this.$store.state.saved.includes(this.data.indexOf(content)))) {
        this.currentContent = content
        this.$emit("showNavbar", false)
      }

      // states which should not change the saveState
      if (bookmark && (!this.$store.state.saved.includes(this.data.indexOf(content)) || this.$store.state.saved.includes(this.data.indexOf(content)) && this.saveState)) {
        this.saveState = !this.saveState
      }
    },

    closeContent() {
      this.reminderDate = null
      this.currentContent = null
      this.saveState = false
      this.$emit("showNavbar", true)
    },

    returnTimeString(timeString) {
      const date = DateTime.fromISO(timeString)
      return { day: date.setLocale('en-US').toRelativeCalendar(), time: date.toFormat('h:mm a') }
    },
    returnShownDate(timeString) {
      const timeObj = this.returnTimeString(timeString)

      let shownTime = timeObj.day.charAt(0).toUpperCase() + timeObj.day.substring(1)
      if (timeObj.day === "today") {
        shownTime = timeObj.time
      }
      return shownTime
    },

    async checkForSave(content) {
      this.openContent(content, true)
      this.changeSaveState(content)
    },

    async createPushNotification() {
      const notifString = await this.returnTimeString(this.notificationDate)
      await axios.post(process.env.VUE_APP_API_SERVER_URL + "/showMessage", { external_id: this.$store.state.accountID, message: `Reminder successfully set for ${notifString.day} at ${notifString.time}!` })
      await axios.post(process.env.VUE_APP_API_SERVER_URL + "/createNotification", { external_id: this.$store.state.accountID, content: { id: this.data.indexOf(this.currentContent), ...this.currentContent }, date: this.notificationDate }).then(async (response) => {
        const oldNotif = this.$store.state.notifs.find(index => index.content === response.data.content)
        if (oldNotif !== undefined) {
          await axios.post(process.env.VUE_APP_API_SERVER_URL + "/cancelNotification", { oldNotif: oldNotif.id })
        }

        this.$store.dispatch("setNotification", response.data)
        this.closeContent()
      })
    },

    async changeSaveState(content) {
      const contentID = this.data.indexOf(content)

      if (this.$store.state.saved.includes(contentID)) {
        this.$store.dispatch("removeState", { content: contentID, state: "saved" })
      } else {
        this.$store.dispatch("addState", { content: contentID, state: "saved" })
      }
    },

    returnFollowUp() {
      return this.data.find(index => index.locked_by === this.data.indexOf(this.currentContent))
    }
  },

  created() {
    setInterval(() => {
      this.currentTime = DateTime.now()
    }, 100)
  }
};
</script>

<style lang="scss">
@use "variables" as v;

#home {
  gap: 2em;
  //padding: 0 v.$viewport-padding-horizontal;

  >div {
    gap: 1em;

    &:first-child {
      align-items: flex-start;
    }
  }

  #accent {
    color: v.$primary-color;

    img {
      width: 1.25em;
      transform: translate(-25%, -25%);
      position: absolute;
      background: none;
    }
  }
}

#actionButtons {
  gap: 0.5em;

  button {
    flex-grow: 1;
  }
}

#startBite {
  gap: 1.25em;

  #note {
    gap: 0.125em;
    right: 3.875%;
    top: 7%;

    img {
      transform: scaleY(-1) rotate(4.769deg);
    }

    h4 {
      transform: rotate(8.555deg);
    }
  }

  >h4 {
    font-weight: bold;
    margin-bottom: -0.75em;
  }
}

#follow-up {
  gap: 0.5em;
  height: 5.75em;

  &.hidden {
    height: 1px;
    margin-top: -1.375em;
    opacity: 0;
    overflow: hidden;
  }

  h4 {
    font-weight: bold;
  }
}

#bite-container {
  &.due {
    background-color: rgba(v.$primary-color, 0.4);
  }

  &.follow-up {
    padding: 0;
    background: none;
    align-items: center;

    h4 {
      flex-grow: 1;
    }

    #image {
      aspect-ratio: 7/4;
      justify-content: center;

      >svg {
        z-index: 1;
        height: 1.25em;
      }

      >div {
        position: absolute;
        background-color: rgba(v.$background-color, 0.6);
        width: 100%;
        height: 100%;
      }
    }
  }

  >img {
    width: 1.5em;
    margin-right: 0.125em;
  }

  >h4 {
    font-weight: bold;
  }
}

.recommended {
  gap: 0.5em;

  >div {
    left: -(v.$viewport-padding-horizontal);
    width: calc(100vw - 2*(v.$viewport-padding-horizontal));
  }
}
</style>