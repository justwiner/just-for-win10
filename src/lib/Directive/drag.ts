import Vue from 'vue';

Vue.directive('drag', {
    bind(el: HTMLElement, binding, vnode: any) {
        const oDiv = el;   // 获取当前元素
        oDiv.onmousedown = (e) => {
            // 算出鼠标相对元素的位置
            const disX = e.clientX - oDiv.offsetLeft;
            const disY = e.clientY - oDiv.offsetTop;
            vnode.context.layerHelper && vnode.context.layerHelper(true);
            document.onmousemove = (e) => {
                // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                const left = e.clientX - disX;
                let top = e.clientY - disY;
                // 移动当前元素
                oDiv.style.left = left + 'px';
                if (top < 0) { top = 0; }
                oDiv.style.top = top + 'px';
                vnode.context.prePosition = [left, top];
            };
            document.onmouseup = (e) => {
                document.onmousemove = null;
                document.onmouseup = null;
                vnode.context.layerHelper && vnode.context.layerHelper(false);
            };
        };
    },
});
