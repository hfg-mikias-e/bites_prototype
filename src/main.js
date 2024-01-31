import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import OneSignalVuePlugin from '@onesignal/onesignal-vue3'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(fas, far, fab);

createApp(App).component("icon", FontAwesomeIcon).use(store).use(router)
.use(OneSignalVuePlugin, {
  appId: process.env.VUE_APP_ONESIGNAL_APP_ID,
  safari_web_id: "web.onesignal.auto."+process.env.VUE_APP_ONESIGNAL_WEB_ID,
  welcomeNotification: {
    title: "Notifications active!",
    message: "You'll now be reminded of your pending Bites and Sips!"
  },
  allowLocalhostAsSecureOrigin: true
})
.mount('#app')