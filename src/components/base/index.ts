import Vue from 'vue';
import JustButton from './just-button/index.vue';
import JustMessage from './just-message/index';
import JustPoper from './just-Poper/index.vue';

Vue.component('just-button', JustButton);
Vue.component('just-poper', JustPoper);
Vue.use(JustMessage);
