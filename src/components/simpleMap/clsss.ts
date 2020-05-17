declare global {
    interface Window {
        [key: string]: any;
    }
}

interface Provence {
    city: string;
    citycode: string;
    district: string;
    province: string;
}

export {
    Provence,
};
