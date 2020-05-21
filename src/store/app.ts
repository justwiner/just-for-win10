const apps = [
    {
        name: '个人博客',
        type: 'iframe',
        url: 'https://www.winerlu.com/',
        icon: require('../assets/icon/blog.png'),
        defaultSize: ['90%', '80%'],
        id: 1,
    },
    {
        name: 'mess-cli脚手架',
        type: 'iframe',
        url: 'https://www.messcli.cn/',
        icon: require('../assets/icon/mess-cli.png'),
        defaultSize: ['90%', '80%'],
        id: 2,
    },
    {
        name: 'mess-cli DEMO',
        type: 'iframe',
        url: 'https://demo.messcli.cn/',
        icon: require('../assets/icon/mess-demo.png'),
        defaultSize: ['90%', '80%'],
        id: 3,
    },
    {
        name: '计算器',
        type: 'app',
        icon: require('../assets/icon/calculator.svg'),
        component: 'calculator',
        defaultSize: ['50%', '80%'],
        id: 4,
    },
    {
        name: '主题色-颜色拾取',
        type: 'app',
        icon: require('../assets/icon/colorPick.svg'),
        component: 'colorPick',
        defaultSize: ['50%', '80%'],
        id: 5,
    },
    {
        name: '全国天气温度',
        type: 'app',
        icon: require('../assets/icon/map.svg'),
        component: 'simpleMap',
        defaultSize: ['50%', '80%'],
        id: 6,
    },
    {
        name: '工具箱',
        type: 'app',
        icon: require('../assets/icon/toolBox.svg'),
        component: 'toolBox',
        defaultSize: ['80%', '80%'],
        id: 7,
    },
    {
        name: '简单的动画',
        type: 'app',
        icon: require('../assets/icon/animate.svg'),
        component: 'animates',
        defaultSize: ['100%', '100%'],
        id: 8,
    },
];

const totalLength = 18 * 6;

const tempArr = new Array(totalLength - apps.length);
tempArr.fill({
    name: 'temp',
    type: 'temp',
    url: '',
    icon: '',
});

export default apps.concat(tempArr);
