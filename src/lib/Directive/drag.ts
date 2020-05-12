import Vue from 'vue'

Vue.directive('drag', {  
    bind: function (el: HTMLElement, binding, vnode: any) {
        let oDiv = el;   //获取当前元素
        oDiv.onmousedown = (e) => {
            //算出鼠标相对元素的位置
            let disX = e.clientX - oDiv.offsetLeft;
            let disY = e.clientY - oDiv.offsetTop;
            vnode.context.layerHelper && vnode.context.layerHelper(true)
            document.onmousemove = (e)=>{
                //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                let left = e.clientX - disX;
                let top = e.clientY - disY;
                //移动当前元素
                oDiv.style.left = left + 'px';
                oDiv.style.top = top + 'px';
                vnode.context.prePosition = [left, top]
            };
            document.onmouseup = (e) => {
                document.onmousemove = null;
                document.onmouseup = null;
                vnode.context.layerHelper && vnode.context.layerHelper(false)
            };
        };
    }
})  