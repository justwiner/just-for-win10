import axios from 'axios';

function fullScreenFun() {
    const iFullscreen: boolean = false; // 当前是否全屏状态
    const fullscreenEnabled = document.fullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.msFullscreenEnabled;

    if (fullscreenEnabled) {
        const de = document.documentElement;
        if (iFullscreen) {
            // 关闭全屏
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        } else {
            // 打开全屏
            if (de.requestFullscreen) {
                de.requestFullscreen();
            } else if (de.mozRequestFullScreen) {
                de.mozRequestFullScreen();
            } else if (de.webkitRequestFullScreen) {
                de.webkitRequestFullScreen();
            }
        }
    } else {
        alert('浏览器当前不能全屏');
    }
}

function fullScreenable(): any {
    return document.fullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.msFullscreenEnabled;
}

/**
 * 防抖
 * @param fn
 * @param wait
 */
function debounce(fn: () => void, wait: number): () => void {
    let timeout: any = null;
    return () => {
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(fn, wait);
    };
}

function trimStart(str: string, hitStr: string) {
    if (hitStr == null || hitStr === '') {
        return str.replace(/^s*/, '');
    } else {
        return str.replace(new RegExp('^' + hitStr + '*'), '');
    }
}

const isCancel = axios.isCancel;

function iflogin() {
    const user = sessionStorage.getItem('vbvb');
    if (user === 'wbwb') {
        return true;
    } else {
        return false;
    }
}

function login() {
    sessionStorage.setItem('vbvb', 'wbwb');
}

function ifPC() {
    // 平台、设备和操作系统
    const system = {
        win: false,
        mac: false,
        xll: false,
        ipad: false,
    };
    // 检测平台
    const p = navigator.platform;
    system.win = p.indexOf('Win') === 0;
    system.mac = p.indexOf('Mac') === 0;
    system.xll = (p === 'Xll') || (p.indexOf('Linux') === 0);
    system.ipad = (navigator.userAgent.match(/iPad/i) != null) ? true : false;
    return (system.win || system.mac || system.xll || system.ipad);
}

export {
    fullScreenFun,
    fullScreenable,
    debounce,
    trimStart,
    isCancel,
    iflogin,
    login,
    ifPC,
};
