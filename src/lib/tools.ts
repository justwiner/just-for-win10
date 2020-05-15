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
        if (timeout !== null) { clearTimeout(timeout); }
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

export {
    fullScreenFun,
    fullScreenable,
    debounce,
    trimStart,
};
