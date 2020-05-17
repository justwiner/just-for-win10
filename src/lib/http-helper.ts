import axios from 'axios';
import Storage from './storage-helper';

const source = axios.CancelToken.source();
const http = axios.create();
const storage = new Storage();

http.interceptors.request.use((config) => {
    config.cancelToken = source.token;
    const data = storage.get(config.url);
    if (data && (Date.now() <= data.exppries)) {
        console.log(`接口：${config.url}缓存命中`);
        source.cancel(data.data);
    }
    return config;
});

http.interceptors.response.use((res) => {
    if (res.data && res.data.type === 0) {
        if (res.config.data) {
            const dataParse = JSON.parse(res.config.data);
            if (dataParse.cache) {
                if (!dataParse.cacheTime) {
                    dataParse.cacheTime = 1000 * 60 * 3;
                }
                storage.set(res.config.url, {
                    data: res.data.data,
                    exppries: Date.now() + dataParse.cacheTime,
                });
                console.log(`接口：${res.config.url}设置缓存，缓存时间: ${dataParse.cacheTime}`);
            }
        }
        return res.data.data;
    } else {
        return Promise.reject('接口报错了！');
    }
});

/**
 * 封装 get、post 请求
 * 集成接口缓存过期机制
 * 缓存过期将重新请求获取最新数据，并更新缓存
 * 数据存储在localstorage
 * {
 *      cache: true
 *      cacheTime: 1000 * 60 * 3  -- 默认缓存3分钟
 * }
 */
const httpHelper = {
    get(url: string, params: any) {
        return new Promise((resolve, reject) => {
            http.get(url, params).then(async (res: any) => {
                resolve(res);
            }).catch((error) => {
                if (axios.isCancel(error)) {
                    resolve(error.message);
                } else {
                    return reject(error);
                }
            });
        });
    },
    post(url: string, params: any) {
        return new Promise((resolve, reject) => {
            http.post(url, params).then(async (res: any) => {
                resolve(res);
            }).catch((error) => {
                if (axios.isCancel(error)) {
                    resolve(error.message);
                } else {
                    return reject(error);
                }
            });
        });
    },
};

export default httpHelper;
