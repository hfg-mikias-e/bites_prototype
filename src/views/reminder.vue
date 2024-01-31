<template>
  <div id="reminder" v-if="content">
    <div class="row">
      <h1>Hey, {{ userData.name }}!<br />It's time for your
        <span id="accent">planned <span v-if="content.practical">Sip</span><span v-else>Bite</span>!
          <Image src="/img/accents/sparkle.png" />
        </span>
      </h1>
    </div>

    <div id="content">
      <h5>planned for today at {{ time }}:</h5>
      <BiteCard :remind="true" :content="content" />
    </div>

    <div class="row" id="actionButtons">
      <Button class="secondary" @click="newDate = true">Postpone</Button>
      <Button v-if="content.practical" class="primary" @click="$router.push('/content/' + content._id)">
        <Image src="/img/sip.svg" />
        Start the Sip!
      </Button>
      <Button v-else class="primary" @click="$router.push('/content/' + content._id)">
        <Image src="/img/bite.svg" />
        Start the Bite!
      </Button>
    </div>

    <SlideOut :open="newDate" :persist="true" @close-slideout="newDate = false">
      <div id="startBite" v-if="content">
        <h2>Set a new reminder</h2>
        <BiteCard :remind="true" :content="content" :details="true" />
        <Notifier @notificationDate="time => setTime(time)" />
        <div class="row" id="actionButtons">
          <Button class="secondary" @click="$router.push('/home')">Skip</Button>
          <Button class="primary" :disabled="future >= 0" @click="createPushNotification">Set Reminder</Button>
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
      content: null,
      future: null,
      notificationDate: null,
      newDate: false
    }
  },

  methods: {
    setTime(time) {
      console.log("setTime")
      this.notificationDate = time[0]
      this.future = time[1]
    },

    returnTimeString(timeString) {
      const date = DateTime.fromISO(timeString)
      return { day: date.setLocale('en-US').toRelativeCalendar(), time: date.toFormat('h:mm a') }
    },

    async createPushNotification() {
      console.log("create for " + this.content._id)
      await axios.post(process.env.VUE_APP_API_SERVER_URL + "/setNotification", { external_id: this.userData.accountID, content: this.content, date: this.notificationDate })

      const notifString = await this.returnTimeString(this.notificationDate)
      await axios.post(process.env.VUE_APP_API_SERVER_URL + "/showMessage", { external_id: this.userData.accountID, message: `Reminder successfully set for ${notifString.day} at ${notifString.time}!` })

      this.$router.push('/home')
    }
  },

  /*
  watch: {
    userData() {
      this.getRecentReminder()
    }
  },
  */

  created() {
    this.$emit('showNavbar', false)

    this.content = this.data.skills.find(index => index._id === this.$route.params.content)

    console.log(this.content._id)
    console.log(this.userData.notifs)

    if (this.userData.notifs) {
      const notif = this.userData.notifs.find(index => index.content === this.content._id)
      if (notif !== undefined) {
        this.time = DateTime.fromISO(notif.date).toFormat('h:mm a')
        //.setLocale('en-US').toRelativeCalendar()<
      } else {
        this.$router.push("/home")
      }
    }
  },

  beforeUnmount() {
    this.$emit('showNavbar', true)
  }
};
</script>

<style lang="scss">
@use "variables" as v;

#reminder {
  gap: 2em;
  justify-content: space-between;
  //padding: 0 v.$viewport-padding-horizontal;

  h5 {
    font-weight: bold;
    opacity: 0.6;
  }

  #content {
    gap: 0.75em;
  }

  #accent {
    color: v.$primary-color;

    img {
      background: none;
      width: 1em;
      position: absolute;
      transform: translate(5%, 10%);
    }
  }
}
</style>