<template>
  <div id="done">
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
        <h2 v-if="!mystery && content.follow_up && liked">You've <span id="accent">unlocked</span> a Sip!</h2>
        <h2 v-else></h2>
      </Transition>

      <Transition name="fade">
        <div id="note" v-if="time === animationDone && (!evaluation || !content.follow_up)">
          <h4>yummy</h4>
          <Image src="/img/accents/scribble.png" />
        </div>
      </Transition>

      <TransitionGroup name="fade">
        <div id="doneImage" v-for="state in animationDone" :key="state" v-if="!evaluation || !content.follow_up">
          <Transition name="done">
            <img :src="'/img/done/bite-done-' + state + '.png'" v-if="time === state && !content.practical" />
          </Transition>
          <Transition name="done">
            <img :src="'/img/done/sip-done-' + state + '.png'" v-if="time === state && content.practical" />
          </Transition>
        </div>
      </TransitionGroup>


      <TransitionGroup name="fade">
        <div id="followUpImage" v-if="evaluation && content.follow_up && time > 1">
          <Transition name="fade">
            <h1 v-if="mystery">?</h1>
          </Transition>
          <img :class="{ blur: mystery }" src="/img/done/sip-done-1.png" />
        </div>

        <div v-if="time === animationDone && (!evaluation || !content.follow_up)">
          <Transition name="fade">
            <div id="note" v-if="!contentData.fav && !evaluation">
              <h4>add it to<br />your favorites!</h4>
              <Image src="/img/accents/arrow.png" />
            </div>
          </Transition>

          <template v-if="!evaluation">
            <h3>How did you like this Bite?</h3>
            <BiteCard v-if="contentData" :content="contentData" :fav="true" @setFav="favorite" />
            <div class="row actionButtons">
              <Button class="secondary" @click="evaluation = true, liked = false">Not much...</Button>
              <Button class="primary" @click="evaluation = true, liked = true">It was neat!</Button>
            </div>
          </template>
        </div>

        <div v-else-if="evaluation" id="bottomBox">
          <div id="dialog">
            <TransitionGroup name="list">
              <h1 :style="{ opacity: (1 - 0.4 * (time - 1)) }" v-if="liked">Good to know, we will recommend you more Bites
                like this one!</h1>
              <h1 :style="{ opacity: (1 - 0.4 * (time - 1)) }" v-else>That's unfortunate... we'll try to show more
                suitable
                Bites for you in
                the future!</h1>
              <h1 :style="{ opacity: (1 - 0.4 * (time - 2)) }" v-if="time > 1">But wait....</h1>
              <h1 :style="{ opacity: (1 - 0.4 * (time - 3)) }" v-if="time > 2">there is more to explore!</h1>
              <div id="bite-container" class="row details" v-if="time > 3">
                <div id="image" :style="{ backgroundImage: 'url(/img/content/' + content._id + '.png)' }"></div>
                <div id="information">
                  <Badge :area="contentData.category.area">{{ contentData.category.name }}</Badge>
                  <h3>{{ returnFollowUp(content).name }}</h3>
                  <h4 v-if="!saved">{{ returnFollowUp(content).description }}</h4>
                </div>
              </div>
            </TransitionGroup>
          </div>
          <div class="row actionButtons" v-if="time === animationDone">
            <!--<Button class="primary" @click="$router.push('/home')">Back to Home</Button>-->
            <template v-if="liked">
              <Button class="secondary" @click="later = true" icon="fa-regular fa-bookmark">Later</Button>
              <Button class="primary" @click="$router.push('/content/' + returnFollowUp(content)._id)">Jump right
                in!</Button>
            </template>
            <Button v-else @click="$router.push('/home')" class="primary">Take me back to Home</Button>
          </div>
        </div>
      </TransitionGroup>

      <SlideOut :open="later" :persist="!reminder" ref="slideout" @close-slideout="later = false">
        <div id="startBite" v-if="content.follow_up">
          <h2>Set a reminder for this Sip</h2>

          <div id="bite-container" class="row saved">
            <div id="image" :style="{ backgroundImage: 'url(/img/content/' + content._id + '.png)' }"></div>
            <div>
              <Badge :area="content.category.area">{{ content.category.name }}</Badge>
              <h3>{{ content.follow_up.name }}</h3>
              <h4>saved in your library</h4>
            </div>
          </div>

          <Notifier @notificationDate="time => setTime(time)" />

          <div class="row actionButtons">
            <Button class="secondary" @click="closeContent">Skip</Button>
            <Button class="primary" icon="fa-regular fa-bell" :disabled="future >= 0"
              @click="createPushNotification">Remind
              me</Button>
          </div>
        </div>
      </SlideOut>
    </template>

    <template v-else>
      Good work, you're all done here!
      (+1 cookie)
      <Button @click="$router.push('/home')">Take me back to Home</Button>
    </template>
  </div>
</template>

<script>
import Image from '@/components/image.vue';
import Button from '@/components/button.vue';
import Badge from '@/components/badge.vue';
import BiteCard from '@/components/bite-card.vue';
import SlideOut from '@/components/slide-out.vue';
import Notifier from '@/components/notifier.vue';
import axios from 'axios';

export default {
  components: {
    Image,
    BiteCard,
    SlideOut,
    Notifier,
    Button,
    Badge
  },

  emits: ["stars"],

  props: {
    content: Object,
    userData: Object,
    data: Object
  },

  data() {
    return {
      time: 1,
      animationDone: 5,
      contentData: null,
      fav: false,
      evaluation: false,
      mystery: true,
      liked: true,
      later: false,
      future: null,
      notificationDate: null,
      done: false
    };
  },

  methods: {
    setContent(content) {
      if (this.userData.fav) {
        return {
          ...content,
          category: this.data.categories.find(index => index._id === content.category),
          fav: this.userData.fav.some(index => index === content._id)
        }
      } else {
        return {
          ...content,
          category: this.data.categories.find(index => index._id === content.category),
          fav: false
        }
      }
    },

    async closeContent() {
      await axios.post(process.env.VUE_APP_API_SERVER_URL + "/changeBiteState", { userId: this.userData.accountID, state: 'active', biteId: this.content.follow_up.id })
      this.later = false
      this.done = true
    },

    async favorite() {
      await axios.post(process.env.VUE_APP_API_SERVER_URL + "/changeBiteState", { userId: this.userData.accountID, state: 'fav', biteId: this.content._id }).then(async () => {
        this.contentData.fav = !this.contentData.fav
      }).catch((error) => {
        console.error(error)
      })
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
      await this.closeContent()
      console.log("create for " + this.content.follow_up.id)
      await axios.post(process.env.VUE_APP_API_SERVER_URL + "/setNotification", { external_id: this.userData.accountID, content: this.returnFollowUp(this.content), date: this.notificationDate })
    },

    setTime(time) {
      this.notificationDate = time[0]
      this.future = time[1]
    },

    returnFollowUp(content) {
      return this.data.skills.find(index => index._id === content.follow_up)
    }
  },

  watch: {
    evaluation(value) {
      if (value) {
        if (this.liked && this.content.follow_up) {
          this.animationDone = this.animationDone - 1
        } else {
          this.animationDone = 1
        }
        this.setTimer(3000)
      }
    },

    time(time) {
      if (this.evaluation && time === this.animationDone) {
        this.mystery = false
      }
    }
  },

  created() {
    this.$emit("stars", true)
    this.setTimer(800)

    if (this.userData) {
      this.contentData = this.setContent(this.content)
    }

    console.log(this.content.follow_up)
  },

  beforeUnmount() {
    this.$emit("stars", false)
  }
}
</script>

<style lang="scss">
@use "variables" as v;

#done {
  //height: calc(100% - 2*v.$viewport-padding-vertical);
  height: 100%;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 1.5em;
  }

  >#note {
    gap: 0;
    top: calc(15% + 5vh);
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
      right: 2%;
      top: 2.5%;

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
  position: fixed;
  bottom: 0;
  padding: v.$viewport-padding-vertical v.$viewport-padding-horizontal;

  #dialog {
    position: fixed;
    bottom: calc(v.$viewport-padding-vertical + 5.5em);
    gap: 0.5em;
    width: calc(100vw - 2*v.$viewport-padding-horizontal);
  }

  #bite-container {
    margin-top: 0.5em;
  }
}
</style>