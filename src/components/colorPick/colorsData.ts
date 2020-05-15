const colors = [
    [0, 0, '#fff1f0'], [0, 1, '#fff2e8'], [0, 2, '#fff7e6'], [0, 3, '#fffbe6'], [0, 4, '#feffe6'], [0, 5, '#fcffe6'], [0, 6, '#f6ffed'], [0, 7, '#e6fffb'], [0, 8, '#e6f7ff'], [0, 9, '#f0f5ff'], [0, 10, '#f9f0ff'], [0, 11, '#fff0f6'],
    [1, 0, '#ffccc7'], [1, 1, '#ffd8bf'], [1, 2, '#ffe7ba'], [1, 3, '#fff1b8'], [1, 4, '#ffffb8'], [1, 5, '#f4ffb8'], [1, 6, '#d9f7be'], [1, 7, '#b5f5ec'], [1, 8, '#bae7ff'], [1, 9, '#d6e4ff'], [1, 10, '#efdbff'], [1, 11, '#ffd6e7'],
    [2, 0, '#ffa39e'], [2, 1, '#ffbb96'], [2, 2, '#ffd591'], [2, 3, '#ffe58f'], [2, 4, '#fffb8f'], [2, 5, '#eaff8f'], [2, 6, '#b7eb8f'], [2, 7, '#87e8de'], [2, 8, '#91d5ff'], [2, 9, '#adc6ff'], [2, 10, '#d3adf7'], [2, 11, '#ffadd2'],
    [3, 0, '#ff7875'], [3, 1, '#ff9c6e'], [3, 2, '#ffc069'], [3, 3, '#ffd666'], [3, 4, '#fff566'], [3, 5, '#d3f261'], [3, 6, '#95de64'], [3, 7, '#5cdbd3'], [3, 8, '#69c0ff'], [3, 9, '#85a5ff'], [3, 10, '#b37feb'], [3, 11, '#ff85c0'],
    [4, 0, '#ff4d4f'], [4, 1, '#ff7a45'], [4, 2, '#ffa940'], [4, 3, '#ffc53d'], [4, 4, '#ffec3d'], [4, 5, '#bae637'], [4, 6, '#73d13d'], [4, 7, '#36cfc9'], [4, 8, '#40a9ff'], [4, 9, '#597ef7'], [4, 10, '#9254de'], [4, 11, '#f759ab'],
    [5, 0, '#f5222d'], [5, 1, '#fa541c'], [5, 2, '#fa8c16'], [5, 3, '#faad14'], [5, 4, '#fadb14'], [5, 5, '#a0d911'], [5, 6, '#52c41a'], [5, 7, '#13c2c2'], [5, 8, '#1890ff'], [5, 9, '#2f54eb'], [5, 10, '#722ed1'], [5, 11, '#eb2f96'],
    [6, 0, '#cf1322'], [6, 1, '#d4380d'], [6, 2, '#d46b08'], [6, 3, '#d48806'], [6, 4, '#d4b106'], [6, 5, '#7cb305'], [6, 6, '#389e0d'], [6, 7, '#08979c'], [6, 8, '#096dd9'], [6, 9, '#1d39c4'], [6, 10, '#531dab'], [6, 11, '#c41d7f'],
    [7, 0, '#a8071a'], [7, 1, '#ad2102'], [7, 2, '#ad4e00'], [7, 3, '#ad6800'], [7, 4, '#ad8b00'], [7, 5, '#5b8c00'], [7, 6, '#237804'], [7, 7, '#006d75'], [7, 8, '#0050b3'], [7, 9, '#10239e'], [7, 10, '#391085'], [7, 11, '#9e1068'],
    [8, 0, '#820014'], [8, 1, '#871400'], [8, 2, '#873800'], [8, 3, '#874d00'], [8, 4, '#876800'], [8, 5, '#3f6600'], [8, 6, '#135200'], [8, 7, '#00474f'], [8, 8, '#003a8c'], [8, 9, '#061178'], [8, 10, '#22075e'], [8, 11, '#780650'],
    [9, 0, '#5c0011'], [9, 1, '#610b00'], [9, 2, '#612500'], [9, 3, '#613400'], [9, 4, '#614700'], [9, 5, '#254000'], [9, 6, '#092b00'], [9, 7, '#002329'], [9, 8, '#002766'], [9, 9, '#030852'], [9, 10, '#120338'], [9, 11, '#520339'],
];
const level = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const colorName = ['薄暮', '火山', '日暮', '金盏花', '日出', '青柠', '极光绿', '明青', '拂晓蓝', '极客蓝', '酱紫', '法式洋红'];

function renderItem(params: any, api: any) {
    const values = [api.value(0), api.value(1)];
    const coord = api.coord(values);
    const size = api.size([1, 1], values);
    return {
        type: 'sector',
        shape: {
            cx: params.coordSys.cx,
            cy: params.coordSys.cy,
            r0: coord[2] - size[0] / 2,
            r: coord[2] + size[0] / 2,
            startAngle: -(coord[3] + size[1] / 2),
            endAngle: -(coord[3] - size[1] / 2),
        },
        style: api.style({
            fill: colors[params.dataIndex][2],
        }),
    };
}

const options = {
    legend: {
        data: ['色彩搭配'],
    },
    polar: {},
    tooltip: {
        formatter(parmas: any) {
            return `<span>${colorName[parmas.data[1]]}：</span><span style='color:${parmas.data[2]}'>${parmas.data[2]}</span>`;
        },
    },
    radiusAxis: {
        type: 'category',
        data: level,
        z: 100,
    },
    angleAxis: {
        type: 'category',
        data: colorName,
        boundaryGap: false,
        splitLine: {
            show: true,
            lineStyle: {
                color: '#ddd',
                type: 'dashed',
            },
        },
        axisLine: {
            show: false,
        },
    },
    series: [{
        name: 'Punch Card',
        type: 'custom',
        coordinateSystem: 'polar',
        itemStyle: {
            color: '#d14a61',
        },
        renderItem,
        data: colors,
    }],
};

export default options;
