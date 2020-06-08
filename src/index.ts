import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import eventBus from './lib/bus';
import './components/base/index';
import './css/index.scss';
import './lib/Directive/index';
import './lib/custom-polify';

import './lib/deps-helper.js';

import singleSpaVue from 'single-spa-vue';

Vue.config.productionTip = false;

Vue.prototype.bus = eventBus;

let el = document.getElementById('win10_portal');
if (!el) {
  el = document.createElement('div');
  el.id = 'win10_portal';
  document.body.appendChild(el);
}

const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    router,
    store,
    render: (h: any) => h(App),
    el: '#win10_portal',
  },
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = (props: any) => {
  Vue.prototype.$singleSpa = props;
  return vueLifecycles.mount(props);
};
export const unmount = vueLifecycles.unmount;
