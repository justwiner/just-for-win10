import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    msgList: [],
    currentTime: '',
  },
  mutations: {
    updateTime(state, time) {
      state.currentTime = time;
    },
  },
  actions: {
  },
  modules: {
  },
});
