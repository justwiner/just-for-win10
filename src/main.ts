import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import eventBus from './lib/bus'
import './css/index.scss';
import './lib/Directive/index'

Vue.config.productionTip = false;

Vue.prototype.bus = eventBus

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
