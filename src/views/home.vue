<template>
  <div id="home" v-if="userData && skills">
    <div class="row">
      <h1>Hey, {{ userData.name }}!<br />Here are {{ skills.length }} helpful skills
        <span id="accent">for you
          <Image src="/img/accents/show.png" />
        </span>
      </h1>
      <Button icon="fa-regular fa-bell" class="icon" />
    </div>

    <!--
    <div v-if="due">
      <BiteCard v-for="skill in due" :key="skill" :content="skill" @click="openContent(skill)" :time="skill.time"
        class="due" @setBookmark="checkForSave(skill)" />
    </div>
-->

    <div v-if="skills">
      <BiteCard v-for="skill in skills" :key="skill" :content="skill" @click="openContent(skill)" :time="skill.time"
        @setBookmark="checkForSave(skill)" />
    </div>

    <!--
      <Button @click="externalRedirect('https://pomofocus.io/')">TEST</Button>
      <video controls>
        <source src="@/assets/media/Massively Transformative Purpose (MTP).mp4" type="video/mp4">
      </video>
      <audio controls>
        <source src="@/assets/media/Die 4-7-8 Atemtechnik Geführte Übung zum Mitmachen.mp3" type="audio/mpeg">
      </audio>
      -->

    <SlideOut :open="currentContent !== null" :persist="!saveState" ref="slideout" @close-slideout="closeContent">
      <div id="startBite" v-if="currentContent">
        <h2 v-if="saveState">Want to add a reminder?</h2>
        <template v-else>
          <h2 v-if="!currentContent.practical">Start this Bite?</h2>
          <h2 v-else>Start this Sip?</h2>
        </template>

        <Transition name="fade">
          <div id="note" v-if="!saveState && !currentContent.saved">
            <h4>bad timing?</h4>
            <Image src="/img/accents/arrow.png" />
          </div>
        </Transition>

        <BiteCard :details="true" :saved="saveState" :content="currentContent"
          @setBookmark="checkForSave(currentContent)" />

        <template v-if="currentContent.follow_up && !saveState">
          <h4>Unlocks the following Sip:</h4>
          <div id="bite-container" class="row follow-up">
            <div id="image" :style="{ backgroundImage: 'url(/img/content/' + currentContent._id + '.png)' }">
              <icon icon="lock" />
              <div />
            </div>
            <h4>{{ returnFollowUp(currentContent) }}</h4>
            <Image src="/img/sip.svg" />
          </div>
        </template>

        <Notifier v-if="saveState" @notificationDate="time => setTime(time)" />

        <div class="row" id="actionButtons">
          <Button class="primary" v-if="!saveState" @click="$router.push('/content/' + currentContent._id)">
            <Image v-if="currentContent.practical" src="/img/sip.svg" />
            <Image v-else src="/img/bite.svg" />Start it!
          </Button>
          <template v-else>
            <Button class="secondary" @click="closeContent">Skip</Button>
            <Button class="primary" :disabled="future >= 0" @click="createPushNotification">Set Reminder</Button>
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
import { DateTime } from 'luxon'

export default {
  components: {
    SlideOut,
    Notifier,
    BiteCard,
    Image,
    Button
  },

  props: {
    userData: Object,
    data: Object,
  },

  emits: ["showNavbar"],

  data() {
    return {
      messageData: null,
      currentContent: null,
      saveState: false,
      future: null,
      notificationDate: null,
      skills: null,
      currentTime: null
    }
  },

  methods: {
    randomNumber(min, max) {
      return Math.random() * (max - min) + min
    },

    setTime(time) {
      console.log("setTime")
      this.notificationDate = time[0]
      this.future = time[1]
    },

    setContent(content) {
      if (this.userData.active) {
        const isSaved = this.userData.active.some(index => index === content._id)

        if (isSaved) {
          if (this.userData.notifs) {
            const isTimed = this.userData.notifs.some(index => index.content === content._id)

            if (isTimed) {
              return {
                ...content,
                category: this.data.categories.find(index => index._id === content.category),
                saved: isSaved,
                time: this.returnShownDate(this.userData.notifs.find(index => index.content === content._id).date)
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

    openContent(content, bookmark) {
      if (bookmark === undefined) {
        bookmark = false
      }

      // don't open Slideout if bookmarked (when bookmark clicked)
      if (!bookmark || (bookmark && !content.saved)) {
        this.currentContent = content
        this.$emit("showNavbar", false)
      }

      // states which should not change the saveState -> possibly more simple if closeContent doesn't reset saveState ...
      if (!((bookmark && !this.currentContent) || (!this.saveState && !bookmark) || (this.currentContent && content.saved && !this.saveState))) {
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
      console.log("create for " + this.currentContent._id)
      await axios.post(process.env.VUE_APP_API_SERVER_URL + "/setNotification", { external_id: this.userData.accountID, content: this.currentContent, date: this.notificationDate })

      const notifString = await this.returnTimeString(this.notificationDate)
      await axios.post(process.env.VUE_APP_API_SERVER_URL + "/showMessage", { external_id: this.userData.accountID, message: `Reminder successfully set for ${notifString.day} at ${notifString.time}!` })

      // add notification date
      this.skills = this.skills.map(index => {
        if (index._id === this.currentContent._id) {
          return {
            ...index,
            saved: true,
            time: this.returnShownDate(this.notificationDate)
          }
        }
        return index
      })

      this.closeContent()
    },

    async changeSaveState(content) {
      await axios.post(process.env.VUE_APP_API_SERVER_URL + "/changeBiteState", { userId: this.userData.accountID, state: 'active', biteId: content._id }).then(async () => {
        this.skills = this.skills.map(index => {
          if (index._id === content._id) {
            return {
              ...index,
              saved: !index.saved,
              time: null
            }
          }

          return index
        })

        if (this.currentContent) {
          this.currentContent.saved = !this.currentContent.saved
        }
      }).catch((error) => {
        console.error(error)
      })
    },

    returnFollowUp(content) {
      return this.data.skills.find(index => index._id === content.follow_up).name
    }
  },

  created() {
    setInterval(() => {
      this.currentTime = DateTime.now()
    }, 100)


    this.skills = this.data.skills.filter(index => !index.unlockedBy).map(index => this.setContent(index))
    if (this.userData.done) {
      this.skills = this.skills.filter(index => this.userData.done.some(con => con === index._id) === false)
    }

    /*
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude);
      });
    }
    */
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

      h1 {
        margin-top: 0.25em;
      }
    }
  }

  #accent {
    color: v.$primary-color;

    img {
      background: none;
      width: 1.25em;
      position: absolute;
      transform: translate(-25%, -25%);
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
    right: 3.5%;
    top: 5%;

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

#bite-container {
  &.due {
    background-color: rgba(v.$primary-color, 0.4);
  }

  &.follow-up {
    padding: 0;
    background: none;
    align-items: center;

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