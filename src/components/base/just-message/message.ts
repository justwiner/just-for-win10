import Vue from 'vue';
import messageVue from './message.vue';
import {Options, Instance} from './interface';
const defaults = {
    show: false,
    text: '',
    duration: '3000',
    type: '',
    parent: document.body,
};
const messageArr: object[] = [];
const messageVueConstructor = Vue.extend(messageVue);
messageVueConstructor.prototype.close = function(id: number) {
    const vm = this;
    this.$on('after-leave', () => {
        if (vm.$el && vm.$el.parentNode) {
            vm.$el.parentNode.removeChild(vm.$el);
        }
        this.$destroy();
    });
    vm.show = false;
    setTimeout(() => {
        removeMessage(id);
    }, 500);
};
const messageBox = (options: Options = {}) => {
    if (Vue.prototype.$isServer) { return; }
    options = Object.assign({}, defaults, options);
    const parent = options.parent;
    const instance: Instance = new messageVueConstructor({
        el: document.createElement('div'),
        data: options,
    });
    parent.prepend(instance.$el);
    Vue.nextTick(() => {
        instance.show = true;
        let id = 0;
        Vue.nextTick(() => {
            instance.$el.style.marginTop = `${(messageArr.length) * 60 + 20}px`;
            id = addMessage(options, instance.$el);
        });
        setTimeout(() => {
            instance.close(id);
        }, options.duration);
    });


    return instance;
};

const addMessage = (options: object, el: any) => {
    /**
     * 生成唯一ID
     */
    const id = Date.now();
    messageArr.push({
        ...options,
        el,
        id,
    });
    return id;
};

const removeMessage = (id: number) => {
    const index = messageArr.findIndex((item: any) => item.id === id);
    if (index > -1) {
        messageArr.splice(index, 1);
        messageArr.forEach((item: any, i: number) => {
            item.el.style.marginTop = i * 60 + 20 + 'px';
        });
    }
};

export default messageBox;
