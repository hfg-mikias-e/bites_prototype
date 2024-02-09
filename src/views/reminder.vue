<template>
    <div id="reminder" v-if="content">
      <div class="row">
        <h1>Hey, {{ $store.state.username }}!<br />It's time for your
          <span id="accent">planned <span v-if="content.practical">Sip</span><span v-else>Bite</span>!
            <Image src="/img/accents/sparkle.png" />
          </span>
        </h1>
      </div>

      <div id="content">
        <h5>planned for today at {{ time }}:</h5>
        <BiteCard :remind="true" :static="true" :content="content" />
      </div>

      <div class="row" id="actionButtons">
        <Button class="secondary" @click="newDate = true">Postpone</Button>
        <Button v-if="content.practical" class="primary" @click="$router.push('/content/' + contentID)">
          <Image src="/img/sip.svg" />
          Start the Sip!
        </Button>
        <Button v-else class="primary" @click="$router.push('/content/' + contentID)">
          <Image src="/img/bite.svg" />
          Start the Bite!
        </Button>
      </div>

      <SlideOut :open="newDate" :persist="true" @close-slideout="newDate = false">
        <div id="startBite" v-if="content">
          <h2>Set a new reminder</h2>
          <BiteCard :remind="true" :content="content" :details="true" />
          <Notifier @notificationDate="time => setTime(time)" :show="true" />
          <div class="row" id="actionButtons">
            <Button class="secondary" @click="$router.push('/')">Skip</Button>
            <Button class="primary" @click="createPushNotification">Set Reminder</Button> <!--:disabled="future >= 0"-->
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
      content: null,
      future: null,
      notificationDate: null,
      newDate: false,
      data: content
    }
  },

  methods: {
    setTime(time) {
      this.notificationDate = time[0]
      this.future = time[1]
    },

    returnTimeString(timeString) {
      const date = DateTime.fromISO(timeString)
      return { day: date.setLocale('en-US').toRelativeCalendar(), time: date.toFormat('h:mm a') }
    },

    async createPushNotification() {
      const notifString = await this.returnTimeString(this.notificationDate)
      await axios.post(process.env.VUE_APP_API_SERVER_URL + "/showMessage", { external_id: this.$store.state.accountID, message: `Reminder successfully set for ${notifString.day} at ${notifString.time}!` })

      await axios.post(process.env.VUE_APP_API_SERVER_URL + "/createNotification", { external_id: this.$store.state.accountID, content: { id: this.contentID, ...this.content }, date: this.notificationDate }).then(async (response) => {
        const oldNotif = this.$store.state.notifs.find(index => index.content === response.data.content)
        if (oldNotif !== undefined) {
          await axios.post(process.env.VUE_APP_API_SERVER_URL + "/cancelNotification", { oldNotif: oldNotif.id })
        }

        await this.$store.dispatch("setNotification", response.data)
        this.$router.push('/')
      })
    }
  },

  computed: {
    contentID() {
      return Number(this.$route.params.content)
    }
  },

  created() {
    this.$emit('showNavbar', false)
    console.log(this.contentID)
    this.content = this.data[this.contentID]

    const notif = this.$store.state.notifs.find(index => index.content === this.contentID)
    if (notif !== undefined) {
      this.time = DateTime.fromISO(notif.date).toFormat('h:mm a')
    } else {
      this.$router.push("/")
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