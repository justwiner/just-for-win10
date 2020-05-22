import Vue from 'vue';
import JustButton from './just-button/index.vue';
import JustMessage from './just-message/index';
import JustPoper from './just-Poper/index.vue';
import JustLoad from './just-loadLayer/index.vue';

Vue.component('just-button', JustButton);
Vue.component('just-poper', JustPoper);
Vue.component('just-load', JustLoad);
Vue.use(JustMessage);


import {Switch, Card, Input, Tooltip, Button} from 'element-ui';
Vue.use(Switch);
Vue.use(Card);
Vue.use(Input);
Vue.use(Tooltip);
Vue.use(Button);
