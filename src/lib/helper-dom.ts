function mouseMove(callBack: (e: Event) => {}, endCallBack: (e: Event) => {}) {
    document.onmousemove = (e) => {
        if (callBack) {
            callBack(e);
        }
    };
    document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
        if (endCallBack) {
            endCallBack(e);
        }
    };
}

function copyText(text: string) {
    const tempDom = document.createElement('input');
    tempDom.value = text;
    document.body.appendChild(tempDom);
    tempDom.select();
    document.execCommand('copy');
    tempDom.style.display = 'none';
    tempDom.remove();
}

export {
    mouseMove,
    copyText,
};
