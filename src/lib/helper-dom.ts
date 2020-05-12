function mouseMove (callBack: Function, endCallBack: Function) {
    document.onmousemove = (e)=>{
        callBack && callBack(e)
    };
    document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
        endCallBack && endCallBack(e)
    };
}

export {
    mouseMove
}