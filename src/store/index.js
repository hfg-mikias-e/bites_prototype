import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

export default createStore({
  state: {
    //deviceId: "",

    username: "",

    subscribed: false,
    firstTimeUse: true,

    /*
    currentCategory: null,
    categories: [],
    skills: [],

    currentBite: null
    */
  },

  mutations: {
    /*
    SET_DEVICE(state, data) {
      state.deviceId = data;
    },
    */

    SET_SUBSCRIPTION(state, data) {
      state.subscribed = data;
    },
    SET_ONBOARDING(state, data) {
      state.firstTimeUse = data;
    },

    /*
    STORE_CATEGORIES(state, data) {
      state.categories = data;
    },
    STORE_SKILLS(state, data) {
      const index = state.skills.findIndex((index) => index.id === data.id);
      if (index >= 0) {
        state.skills[index].bites = data.bites;
      } else {
        state.skills.push(data);
      }
    },
    STORE_BITE(state, data) {
      state.currentBite = data;
    },
    STORE_CATEGORY(state, data) {
      state.currentCategory = data;
    },
    */

    SET_USERNAME(state, data) {
      state.username = data
    }
  },

  actions: {
    /*
    setDeviceId(state, data) {
      state.commit("SET_DEVICE", data);
    },
    */

    setSubscription(state, data) {
      state.commit("SET_SUBSCRIPTION", data);
    },
    setOnboarding(state, data) {
      state.commit("SET_ONBOARDING", data);
    },

    /*
    storeCategories(state, data) {
      state.commit("STORE_CATEGORIES", data);
    },
    storeSkills(state, data) {
      state.commit("STORE_SKILLS", data);
    },

    storeBite(state, data) {
      state.commit("STORE_BITE", data);
    },
    storeCategory(state, data) {
      state.commit("STORE_CATEGORY", data);
    },
    */

    setUsername(state, data) {
      state.commit("SET_USERNAME", data);
    },
  },

  plugins: [vuexLocal.plugin],
});
