import {App} from './class/app'

class AppService {
    public checkAppRun (runingApps: App[], app: App): Boolean {
        const hitApp = runingApps.find(item => item.id === app.id)
        return hitApp ? true : false
    }
    public closeApp (runingApps: App[], app: App): App[] {
        const hitAppIndex = runingApps.findIndex(item => app.id === item.id)
        if (hitAppIndex >= 0) runingApps.splice(hitAppIndex, 1)
        return runingApps
    }
}

export default AppService