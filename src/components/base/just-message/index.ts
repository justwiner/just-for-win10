import messageBox from './message';
export default {
    install(Vue: any) {
        Vue.prototype.$message = messageBox;
    },
};
