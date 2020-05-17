import http from '@/lib/http-helper';

const baseUrl = 'http://localhost:3000/proxy-api/weather';

function getWeather(cityName?: string) {
    return http.post(`${baseUrl}`, {
        cityName,
        cache: true,
        cacheTime: 1000 * 60 * 60, // 缓存一个小时
    });
}

export {
    getWeather,
};
