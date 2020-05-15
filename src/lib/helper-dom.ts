function mouseMove(callBack: Function, endCallBack: Function) {
    document.onmousemove = (e) => {
        callBack && callBack(e);
    };
    document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
        endCallBack && endCallBack(e);
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
