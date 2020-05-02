const apps = [
    {
        name: '网易云音乐',
        type: 'iframe',
        url: 'https://music.163.com/',
        icon: require('../assets/icon/wangyiyun.jpg'),
    },
    {
        name: '网易云音乐2',
        type: 'iframe',
        url: 'https://music.163.com/',
        icon: require('../assets/icon/wangyiyun.jpg'),
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
