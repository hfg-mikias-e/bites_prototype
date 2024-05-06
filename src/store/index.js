import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

export default createStore({
  state: {
    accountID: "",
    username: "",
    
    subscribed: false,
    firstTimeUse: true,

    saved: [],
    faved: [],
    notifs: []
  },

  mutations: {
    SET_SUBSCRIPTION(state, data) {
      state.subscribed = data;
    },
    SET_ID(state, data) {
      state.accountID = data;
    },
    SET_ONBOARDING(state, data) {
      state.firstTimeUse = data;
    },
    SET_USERNAME(state, data) {
      state.username = data
    },
    SET_NOTIF(state, data) {
      state.notifs = state.notifs.filter(index => index.content !== data.content)
      state.notifs.push(data)
    },

    ADD_STATE(state, data) {
      state[data.state].push(data.content)
    },
    REM_STATE(state, data) {
      state[data.state] = state[data.state].filter(index => index !== data.content)
    }
  },

  actions: {
    setSubscription(state, data) {
      state.commit("SET_SUBSCRIPTION", data);
    },
    setID(state, data) {
      state.commit("SET_ID", data);
    },
    setOnboarding(state, data) {
      state.commit("SET_ONBOARDING", data);
    },
    setUsername(state, data) {
      state.commit("SET_USERNAME", data);
    },
    setNotification(state, data) {
      state.commit("SET_NOTIF", data);
    },

    addState(state, data) {
      state.commit("ADD_STATE", data);
    },
    removeState(state, data) {
      state.commit("REM_STATE", data);
    }
  },

  plugins: [vuexLocal.plugin],
});
