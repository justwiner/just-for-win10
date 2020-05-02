import Vue from 'vue';
import Vuex from 'vuex';
import appData from './app';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    msgList: [],
    currentTime: '',
    app: appData,
  },
  mutations: {
    updateTime(state, time) {
      state.currentTime = time;
    },
    updateApps(state, data) {
      state.app = data;
    },
  },
  actions: {
  },
  modules: {
  },
});
