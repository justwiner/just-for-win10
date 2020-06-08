const deps = [
    'https://webapi.amap.com/maps?v=1.4.15&key=b74b9707fcd4c7aa60f3c8d22a4aaa99',
    'https://assets.winerlu.com/openjs/SplitText.min.js',
    'https://assets.winerlu.com/openjs/canvasSlideshow.js',
    'https://assets.winerlu.com/openjs/pixi.min.js',
    'https://assets.winerlu.com/openjs/TweenMax.min.js'
]

deps.forEach(item => {
    const script = document.createElement('script')
    script.src = item
    document.head.appendChild(script)
})