import Vue from 'vue';
import Vuex from 'vuex';
import appData from './app';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    msgList: [],
    currentTime: '',
    app: appData,
    runingApp: [],
    activeApp: null
  },
  mutations: {
    updateTime(state, time) {
      state.currentTime = time;
    },
    updateApps(state, data) {
      state.app = data;
    },
    updateRuningApp(state, data) {
      state.runingApp = data;
    },
    updateActiveApp(state, data) {
      state.activeApp = data;
    },
  },
  actions: {
  },
  modules: {
  },
});
