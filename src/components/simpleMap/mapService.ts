import {getWeather} from './api';

const TEMCOLOR: {
    [key: string]: number[],
} = {
    '-': [49, 54, 149],
    '0': [49, 54, 149],
    '1': [66, 107, 175],
    '2': [246, 123, 74],
    '3': [165, 0, 38],
    '*': [165, 0, 38],
};

export default class MapService {
    public map: any = null;
    public context: any = null;
    public weatherIcon: any = {};
    public weatherData: any[];
    public areaName: string;
    constructor(map: any, context: any, areaName: string) {
        this.map = map;
        this.context = context;
        this.weatherIcon = [
            {
                type: 0, // 晴
                url: require('@/assets/map/weather/0.png'),
            },
            {
                type: 1, // 多云
                url: require('@/assets/map/weather/1.png'),
            },
            {
                type: 2, // 阴
                url: require('@/assets/map/weather/2.png'),
            },
            {
                type: 3, // 阵雨
                url: require('@/assets/map/weather/3.png'),
            },
            {
                type: 4, // 雷阵雨
                url: require('@/assets/map/weather/4.png'),
            },
            {
                type: 7, // 小雨
                url: require('@/assets/map/weather/7.png'),
            },
            {
                type: 8, // 中雨
                url: require('@/assets/map/weather/8.png'),
            },
            {
                type: 9, // 大雨
                url: require('@/assets/map/weather/9.png'),
            },
            {
                type: 10, // 暴雨
                url: require('@/assets/map/weather/10.png'),
            },
            {
                type: 11, // 大暴雨
                url: require('@/assets/map/weather/11.png'),
            },
            {
                type: 23, // 大到暴雨
                url: require('@/assets/map/weather/23.png'),
            },
        ];
        this.weatherData = [];
        this.areaName = areaName;
    }
    /**
     * 获取天气温度数据
     * @param areaName
     */
    public getWeather(areaName?: string) {
        this.context.weatherStatus = '正在加载天气数据...';
        this.context.weatherLoading = true;
        if (areaName) {
            this.areaName = areaName;
        }
        return new Promise((resolve, reject) => {
            getWeather(this.areaName).then(async (res: any) => {
                if (!res) {
                    return resolve([]);
                }
                const result: any[] = [];
                this.context.weatherStatus = '正在处理天气数据...';
                this.parseWeatherData(res.subArea, result);
                this.weatherData = result;
                resolve(result);
            }).catch((error) => {
                this.context.$message({
                    type: 'error',
                    text: `获取气象数据失败`,
                    parent: this.context.$refs.simpleMap,
                });
            }).finally(() => {
                this.context.closeWeatherBox();
            });
        });
    }
    /**
     * 递归解析带有树形结构的天气数据
     * @param data
     * @param result
     */
    public parseWeatherData(data: any[], result: any[]) {
        data.forEach((item) => {
            if (item.subArea) {
                this.parseWeatherData(item.subArea, result);
            } else {
                result.push(item);
            }
        });
    }
    /**
     * 渲染天气图层
     * @param areaName
     */
    public async renderWeather() {
        this.context.weatherLayer.clear();
        if (this.weatherData.length === 0) {
            await this.getWeather();
        }
        const data = this.weatherData.filter((item: any) => item.longitude).map((item: any) => ({
            ...item,
            lng: item.longitude,
            R: item.longitude,
            lat: item.latitude,
            Q: item.latitude,
        }));
        const points3D = new AMap.Object3D.Points();
        const geometry = points3D.geometry;
        points3D.data = [];
        points3D.transparent = true;
        const lines = new AMap.Object3D.Line();
        const lineGeo = lines.geometry;
        /**
         * 添加纹理
         */
        for (const item of this.weatherIcon) {
            points3D.textures.push(item.url);
        }
        data.forEach((item: any, index: number) => {
            const center = this.lnglatToG20(item);
            lineGeo.vertices.push(center.x, center.y, 0);
            lineGeo.vertexColors.push(0, 0, 0, 1);
            lineGeo.vertices.push(center.x, center.y, -800000);
            lineGeo.vertexColors.push(0, 0, 0, 0.1);

            /**
             * 起始天气
             */
            geometry.vertices.push(center.x, center.y, -1000000);
            geometry.pointSizes.push(30);
            geometry.vertexUVs.push(0, 0, 1, 1);
            geometry.vertexColors.push('#ccc');
            points3D.data.push({
                ...item,
                layer: 'weatherLayer',
            });
            /**
             * 设置纹理索引
             */
            const textureIndex  = this.weatherIcon.findIndex((icon: any) => icon.type === +item.state2);
            geometry.textureIndices.push(textureIndex > -1 ? textureIndex : 0);
        });
        this.context.weatherLayer.add(points3D);
        this.context.weatherLayer.add(lines);
    }
    /**
     * 渲染温度图层
     */
    public async renderTemperature() {
        this.context.temperatureLayer.clear();
        if (this.weatherData.length === 0) {
            await this.getWeather();
        }
        const data = this.weatherData.filter((item: any) => item.longitude).map((item: any) => ({
            ...item,
            lng: item.longitude,
            R: item.longitude,
            lat: item.latitude,
            Q: item.latitude,
        }));
        data.forEach((item) => {
            let tem: string | number = +item.temNow || ((+item.tem1) + (+item.tem2)) / 2;
            if (tem >= 0 && tem < 10) {
                tem = '0' + tem;
            }
            /**
             * 根据温度值确定基准色
             */
            let color: number[] = [];
            for (const key in TEMCOLOR) {
                if (tem.toString().startsWith(key.toString())) {
                    color = TEMCOLOR[key].map((i) => i / 255);
                    break;
                }
            }
            if (color.length === 0) {
                color = TEMCOLOR['*'].map((i) => i / 255);
            }
            /**
             * 根据温度值确定透明度
             */
            color.push(
                // (10 - parseInt(tem.toString(), 10) % 10) / 10,
                1,
            );
            const mesh = this.addRegularPrism(
                this.lnglatToG20(item),
                36,
                500000,
                5000 * Math.abs(parseInt(tem.toString(), 10)),
                color,
            );
            mesh.data = {
                ...item,
                layer: 'temperatureLayer',
            };
            this.context.temperatureLayer.add(mesh);
        });
    }
    /**
     * 经纬度转g20坐标
     * @param item
     */
    public lnglatToG20(item: any) {
        const lngLat: any = this.map.lngLatToGeodeticCoord(item);
        lngLat.x = AMap.Util.format(lngLat.x, 3);
        lngLat.y = AMap.Util.format(lngLat.y, 3);
        return lngLat;
    }
    /**
     * 获取几何图形
     * @param center
     * @param segment
     * @param height
     * @param radius
     */
    public addRegularPrism(
        center: any,
        segment: number,
        height: number,
        radius: number,
        topColor: number[],
        bottomColor: number[] = [1, 1, 1, 1],
        ) {
            const cylinder = new AMap.Object3D.Mesh();
            const geometry = cylinder.geometry;
            const verticesLength = segment * 2;
            const path = [];
            for (let i = 0; i < segment; i += 1) {
            const angle = 2 * Math.PI * i / segment;
            const x = center.x + Math.cos(angle) * radius;
            const y = center.y + Math.sin(angle) * radius;
            path.push([x, y]);
            geometry.vertices.push(x, y, 0); // 底部顶点
            geometry.vertices.push(x, y, -height); // 顶部顶点

            geometry.vertexColors.push.apply(geometry.vertexColors, bottomColor); // 底部颜色
            geometry.vertexColors.push.apply(geometry.vertexColors, topColor); // 顶部颜色

            const bottomIndex = i * 2;
            const topIndex = bottomIndex + 1;
            const nextBottomIndex = (bottomIndex + 2) % verticesLength;
            const nextTopIndex = (bottomIndex + 3) % verticesLength;

            geometry.faces.push(bottomIndex, topIndex, nextTopIndex); // 侧面三角形1
            geometry.faces.push(bottomIndex, nextTopIndex, nextBottomIndex); // 侧面三角形2
        }

        // 构建顶面三角形
            for (let i = 0; i < segment; i += 1) {
            geometry.vertices.push.apply(geometry.vertices, geometry.vertices.slice(i * 6 + 3, i * 6 + 6)); // 底部顶点
            geometry.vertexColors.push.apply(geometry.vertexColors, topColor);
        }

            const triangles = AMap.GeometryUtil.triangulateShape(path);
            const offset = segment * 2;

            for (let v = 0; v < triangles.length; v += 3) {
            geometry.faces.push(triangles[v] + offset, triangles[v + 2] + offset, triangles[v + 1] + offset);
        }

            cylinder.transparent = true; // 如果使用了透明颜色，请设置true
            return cylinder;
    }
}
