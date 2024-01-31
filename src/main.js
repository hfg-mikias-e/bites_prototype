import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//import luxon from "vue-luxon"

import { createAuth0 } from "@auth0/auth0-vue"
import OneSignalVuePlugin from '@onesignal/onesignal-vue3'
//import './registerServiceWorker'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fas, far, fab);

createApp(App).component("icon", FontAwesomeIcon).use(store).use(router)//.use(luxon)
.use(createAuth0({
    domain: process.env.VUE_APP_AUTH0_DOMAIN,
    clientId: process.env.VUE_APP_AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: window.location.origin+'/callback'
    },
})).use(OneSignalVuePlugin, {
  appId: process.env.VUE_APP_ONESIGNAL_APP_ID,
  safari_web_id: "web.onesignal.auto."+process.env.VUE_APP_ONESIGNAL_WEB_ID,
  welcomeNotification: {
    title: "Notifications active!",
    message: "You'll now be reminded of your pending Bites and Sips!"
  },
  allowLocalhostAsSecureOrigin: true
})
.mount('#app')