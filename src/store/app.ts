const apps = [
    {
        name: '个人博客',
        type: 'iframe',
        url: 'https://www.winerlu.com/',
        icon: require('../assets/icon/blog.png'),
        defaultSize: ['50%', '50%'],
        id: 1
    },
    {
        name: 'mess-cli脚手架',
        type: 'iframe',
        url: 'https://www.messcli.cn/',
        icon: require('../assets/icon/mess-cli.png'),
        defaultSize: ['50%', '50%'],
        id: 2
    },
    {
        name: 'mess-cli DEMO',
        type: 'iframe',
        url: 'https://demo.messcli.cn/',
        icon: require('../assets/icon/mess-demo.png'),
        defaultSize: ['50%', '50%'],
        id: 3
    },
    {
        name: '计算器',
        type: 'app',
        icon: require('../assets/icon/calculator.svg'),
        component: 'calculator',
        defaultSize: ['50%', '80%'],
        id: 4
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
