import {App} from './class/app';

class AppService {
    public checkAppRun(runingApps: App[], app: App): boolean {
        const hitApp = runingApps.find((item) => item.id === app.id);
        return hitApp ? true : false;
    }
    public closeApp(runingApps: App[], app: App): App[] {
        const hitAppIndex = runingApps.findIndex((item) => app.id === item.id);
        if (hitAppIndex >= 0) { runingApps.splice(hitAppIndex, 1); }
        return runingApps;
    }
    public runApp(app: App, context: any) {
        if (this.checkAppRun(context.runingApp, app)) {
            context.bus.$emit('activeAppFn', app);
        } else {
            const runingApp = context.runingApp;
            runingApp.push(app);
            context.$store.commit('updateRuningApp', runingApp);
        }
        context.$store.commit('updateActiveApp', app);
    }
}

export default AppService;
