const apps = [
    {
        name: '个人博客',
        type: 'iframe',
        url: 'https://www.winerlu.com/',
        icon: require('../assets/icon/blog.png'),
    },
    {
        name: 'mess-cli脚手架',
        type: 'iframe',
        url: 'https://www.messcli.cn/',
        icon: require('../assets/icon/mess-cli.png'),
    },
    {
        name: 'mess-cli DEMO',
        type: 'iframe',
        url: 'https://demo.messcli.cn/',
        icon: require('../assets/icon/mess-demo.png'),
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
