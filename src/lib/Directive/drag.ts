import Vue from 'vue';

Vue.directive('drag', {
    bind(el: HTMLElement, binding, vnode: any) {
        const oDiv = el;   // 获取当前元素
        oDiv.onmousedown = (e: MouseEvent) => {
            // 算出鼠标相对元素的位置
            const disX = e.clientX - oDiv.offsetLeft;
            const disY = e.clientY - oDiv.offsetTop;
            if (vnode.context.layerHelper) {
                vnode.context.layerHelper(true);
            }
            document.onmousemove = (event: MouseEvent) => {
                // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                const left = event.clientX - disX;
                let top = event.clientY - disY;
                // 移动当前元素
                oDiv.style.left = left + 'px';
                if (top < 0) { top = 0; }
                oDiv.style.top = top + 'px';
                vnode.context.prePosition = [left, top];
            };
            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
                if (vnode.context.layerHelper) {
                    vnode.context.layerHelper(false);
                }
            };
        };
    },
});
