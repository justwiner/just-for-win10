import {getWeather} from './api';

export default class MapService {
    public map: any = null;
    public context: any = null;
    public weatherIcon: any = {};
    constructor(map: any, context: any) {
        this.map = map;
        this.context = context;
        this.weatherIcon = [
            {
                type: 0,
                url: require('@/assets/map/weather/0.png'),
            },
            {
                type: 1,
                url: require('@/assets/map/weather/1.png'),
            },
            {
                type: 2,
                url: require('@/assets/map/weather/2.png'),
            },
            {
                type: 3,
                url: require('@/assets/map/weather/3.png'),
            },
            {
                type: 4,
                url: require('@/assets/map/weather/4.png'),
            },
            {
                type: 7,
                url: require('@/assets/map/weather/7.png'),
            },
            {
                type: 8,
                url: require('@/assets/map/weather/8.png'),
            },
            {
                type: 9,
                url: require('@/assets/map/weather/9.png'),
            },
            {
                type: 10,
                url: require('@/assets/map/weather/10.png'),
            },
            {
                type: 11,
                url: require('@/assets/map/weather/11.png'),
            },
            {
                type: 23,
                url: require('@/assets/map/weather/23.png'),
            },
        ];
    }
    public getWeather() {
        this.context.weatherStatus = '正在加载全国区县天气数据...';
        this.context.weatherLoading = true;
        return new Promise((resolve, reject) => {
            getWeather('china').then(async (res: any) => {
                const result: any[] = [];
                this.context.weatherStatus = '正在处理全国区县天气数据...';
                this.parseWeatherData(res.subArea, result);
                resolve(result);
            }).catch((error) => {
                this.context.$message({
                    type: 'error',
                    text: `获取全国区县气象数据失败`,
                    parent: this.context.$refs.simpleMap,
                });
            }).finally(() => {
                this.context.closeWeatherBox();
            });
        });
    }
    public parseWeatherData(data: any[], result: any[]) {
        data.forEach((item) => {
            if (item.subArea) {
                this.parseWeatherData(item.subArea, result);
            } else {
                result.push(item);
            }
        });
    }
    public renderWeather() {
        this.getWeather().then((res: any) => {
            const data = res.filter((item: any) => item.longitude).map((item: any) => ({
                ...item,
                lng: item.longitude,
                R: item.longitude,
                lat: item.latitude,
                Q: item.latitude,
            }));
            const points3D = new AMap.Object3D.Points();
            const geometry = points3D.geometry;
            const lines = new AMap.Object3D.Line();
            const lineGeo = lines.geometry;
            points3D.transparent = true;
            /**
             * 添加纹理
             */
            for (const item of this.weatherIcon) {
                points3D.textures.push(item.url);
            }
            data.forEach((item: any, index: number) => {
                const center = this.lnglatToG20(item);
                lineGeo.vertices.push(center.x, center.y, 0);
                lineGeo.vertexColors.push(0, 1, 1, 1);
                lineGeo.vertices.push(center.x, center.y, -1000000);
                lineGeo.vertexColors.push(0, 1, 1, 1);

                geometry.vertices.push(center.x, center.y, -1000000);
                geometry.pointSizes.push(50);
                geometry.vertexUVs.push(0, 0, 1, 1);
                geometry.vertexColors.push('#ccc');
                /**
                 * 设置纹理索引
                 */
                const textureIndex  = this.weatherIcon.findIndex((icon: any) => icon.type === +item.state2);
                geometry.textureIndices.push(textureIndex > -1 ? textureIndex : 0);
            });
            this.context.weatherLayer.add(points3D);
            this.context.weatherLayer.add(lines);
        });
    }
    public lnglatToG20(item: any) {
        const lnglat_: any = this.map.lngLatToGeodeticCoord(item);
        lnglat_.x = AMap.Util.format(lnglat_.x, 3);
        lnglat_.y = AMap.Util.format(lnglat_.y, 3);
        return lnglat_;
    }
}
