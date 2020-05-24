// import WindCore, {
//     Field,
//     isArray,
//     formatData,
//     warnLog,
//     assign,
//     createCanvas,
//     defaultOptions,
//     IOptions,
// } from 'wind-core';

// export interface IWindOptions extends IOptions {
//     opacity: number;
//     zIndex: number;
//     zooms: [number, number];
//     bounds: any;
//     context: '2d';
//     windOptions: Partial < IOptions > ;
//     [key: string]: any;
// }

// const G = typeof window === 'undefined' ? global : window;
// // @ts-ignore
// const AMap = G ? window.AMap : null ;

// if (!AMap) {
//     throw new Error('Before using this plugin, you must first introduce the amap JS API <https://lbs.amap.com/api/javascript-api/summary>');
// }

// const OPTIONS = {
//     context: '2d',
//     animation: false,
//     opacity: 1,
//     zIndex: 12,
//     zooms: [0, 22],
//     windOptions: {},
//     visible: true,
// };

// class AMapWind {
//     private options: IWindOptions;
//     private canvas: HTMLCanvasElement | null;
//     private wind: WindCore | null;
//     private context = '2d';
//     private field: Field | undefined;
//     private map: any;
//     private windLayer: any;
//     private visible: any = true;

//     constructor(data: any, options: Partial < IWindOptions > = {}) {
//         this.options = assign({}, OPTIONS, options);

//         /**
//          * internal
//          * @type {null}
//          */
//         this.canvas = null;

//         /**
//          * canvas layer
//          * @type {null}
//          * @private
//          */
//         this.windLayer = null;

//         /**
//          * windy layer
//          * @type {null}
//          */
//         this.wind = null;

//         /**
//          * bind context
//          * @type {{new(...args: any[][]): any} | ((...args: any[][]) => any) | ((...args: any[]) => any) | any | {new(...args: any[]): any}}
//          */
//         this.init = this.init.bind(this);
//         this.handleResize = this.handleResize.bind(this);
//         this.canvasFunction = this.canvasFunction.bind(this);
//         this._addReFreshHandle = this._addReFreshHandle.bind(this);

//         this.pickWindOptions();
//         this.initVisibleStyle();
//         if (data) {
//             this.setData(data);
//         }
//     }
//     public initVisibleStyle() {
//         const style: any = document.createElement('style');
//         style.type = 'text/css';
//         style.id = 'amap-wind-css';
//         try {
//             style.appendChild(
//                 document.createTextNode(`
//                 .amap-wind-show{display: block !important}
//                 .amap-wind-hidden{display: none !important}
//                 `),
//             );
//         } catch (ex) {
//             style.styleSheet.cssText = `
//             .amap-wind-show{display: block !important}
//             .amap-wind-hidden{display: none !important}
//             `;
//         }
//         document.getElementsByTagName('head')[0].appendChild(style);
//     }
//     /**
//      * append layer to map
//      * @param map
//      */
//     public appendTo(map: any) {
//         if (map) {
//             this.init(map);
//         } else {
//             throw new Error('not map object');
//         }
//     }

//     /**
//      * init windy layer
//      * @param map
//      */
//     public init(map: any) {
//         if (map) {
//             this.map = map;
//             this.context = this.options.context || '2d';
//             this.getCanvasLayer();
//             this.map.on('resize', this.handleResize, this);
//         } else {
//             throw new Error('not map object');
//         }
//     }

//     public handleResize() {
//         if (this.canvas) {
//             this.canvasFunction();
//         }
//     }

//     /**
//      *  render layer
//      * @param canvas
//      * @returns {*}
//      */
//     public render(canvas: HTMLCanvasElement) {
//         if (!this.getData()) { return this; }
//         const opt = this.getWindOptions();
//         if (canvas && !this.wind) {
//             const data = this.getData();

//             const ctx = this.getContext();

//             if (ctx) {
//                 this.wind = new WindCore(ctx, opt, data);

//                 this.wind.project = this.project.bind(this);
//                 this.wind.unproject = this.unproject.bind(this);
//                 this.wind.intersectsCoordinate = this.intersectsCoordinate.bind(this);
//                 this.wind.postrender = () => {
//                     // @ts-ignore
//                     // this.setCanvasUpdated();
//                 };
//             }
//         }

//         if (this.wind) {
//             this.wind.prerender();
//             this.wind.render();
//         }

//         // 2D视图时可以省略
//         this._addReFreshHandle();
//         return this;
//     }

//     /**
//      * 3D模式下手动刷新
//      * @private
//      */
//     public _addReFreshHandle() {
//         if (!this.map) { return; }
//         const type = this.map.getViewMode_();
//         if (type.toLowerCase() === '3d') {
//             if (this.windLayer) {
//                 this.windLayer.reFresh();
//             }
//             AMap.Util.requestAnimFrame(this._addReFreshHandle);
//         }
//     }

//     /**
//      * get canvas layer
//      */
//     public getCanvasLayer() {
//         if (!this.canvas && !this.windLayer) {
//             const canvas = this.canvasFunction();
//             const bounds = this._getBounds();

//             const ops: {
//                 canvas: HTMLCanvasElement | null | undefined,
//                 bounds ?: any;
//                 zooms ?: [number, number];
//                 zIndex ?: number;
//                 opacity ?: number;
//             } = {
//                 canvas,
//                 bounds: this.options.bounds || bounds,
//             };

//             if (this.options.zooms) {
//                 ops.zooms = this.options.zooms;
//             }

//             if ('zIndex' in this.options && typeof this.options.zIndex === 'number') {
//                 ops.zIndex = this.options.zIndex;
//             }

//             if ('opacity' in this.options && typeof this.options.opacity === 'number') {
//                 ops.opacity = this.options.opacity;
//             }

//             this.windLayer = new AMap.CanvasLayer(ops);
//             this.map.on('movestart', this._hide, this);
//             this.map.on('mapmove', this._hide, this);
//             this.map.on('moveend', this.canvasFunction, this);
//             this.map.on('zoomchange', this.canvasFunction, this);
//             this.windLayer.setMap(this.map);
//         }
//     }

//     /**
//      * canvas constructor
//      * @returns {*}
//      */
//     public canvasFunction() {
//         if (!this.visible) {
//             return;
//         }
//         const retina = AMap.Browser.retina ? 2 : 1;
//         const [width, height]: [number, number] = [this.map.getSize().width, this.map.getSize().height];
//         if (!this.canvas) {
//             this.canvas = createCanvas(width, height, retina, null);
//         } else {
//             this.canvas.width = width * retina;
//             this.canvas.height = height * retina;
//             const bounds = this._getBounds();
//             if (this.windLayer) {
//                 this.windLayer.setBounds(this.options.bounds || bounds);
//             }
//         }
//         if (this.canvas) {
//             this.render(this.canvas);
//         }
//         this.show();
//         return this.canvas;
//     }

//     /**
//      * fixed viewMode
//      * @private
//      */
//     public _getBounds() {
//         const type = this.map.getViewMode_();
//         let [southWest, northEast] = [undefined, undefined];
//         const bounds = this.map.getBounds();
//         if (type.toLowerCase() === '2d') {
//             northEast = bounds.getNorthEast(); // xmax ymax
//             southWest = bounds.getSouthWest(); // xmin ymin
//         } else {
//             // TODO: 高德地图3D模式下目前返回的bounds顺序为左上-右上-右下-左下-左上
//             const arrays = bounds.bounds.map((item: any) => {
//                 return [item.getLng(), item.getLat()];
//             });
//             // const extent = getExtent(arrays);
//             southWest = new AMap.LngLat(arrays[3][0], arrays[3][1]);
//             northEast = new AMap.LngLat(arrays[1][0], arrays[1][1]);
//         }
//         return new AMap.Bounds(southWest, northEast);
//     }

//     /**
//      * remove layer
//      */
//     public removeLayer() {
//         if (!this.map) { return; }
//         if (this.windLayer) {this.windLayer.setMap(null); }
//         this.map.off('resize', this.handleResize, this);
//         this.map.off('movestart', this._hide, this);
//         this.map.off('mapmove', this._hide, this);
//         this.map.off('moveend', this.canvasFunction, this);
//         this.map.off('zoomchange', this.canvasFunction, this);
//         delete this.map;
//         delete this.windLayer;
//         delete this.canvas;
//     }

//     public hide() {
//         this._hide(true);
//     }

//     public _hide(stateChange: boolean = false) {
//         if (this.canvas) {
//             if (stateChange === true) {
//                 this.visible = false;
//             }
//             this.canvas.className = 'amap-wind-hidden';
//         }
//     }

//     public show() {
//         this._show(true);
//     }

//     public _show(stateChange: boolean = false) {
//         if (this.canvas) {
//             if (stateChange === true) {
//                 this.visible = true;
//             }
//             this.canvas.className = 'amap-wind-show';
//         }
//     }

//     public project(coordinate: [number, number]): [number, number] {
//         const retina = AMap.Browser.retina ? 2 : 1;
//         const pixel = this.map.lngLatToContainer(new AMap.LngLat(coordinate[0], coordinate[1], true));
//         return [
//             pixel.x * retina,
//             pixel.y * retina,
//         ];
//     }

//     public unproject(pixel: [number, number]): [number, number] {
//         if (!this.map) {
//             return [0, 0];
//         }
//         const coordinate = this.map.pixelToLngLat(new AMap.Pixel(pixel[0], pixel[1]));
//         return [
//             coordinate.lng,
//             coordinate.lat,
//         ];
//     }

//     public intersectsCoordinate(coordinate: [number, number]): boolean {
//         try {
//             const mapExtent = this._getBounds();
//             return mapExtent.contains(new AMap.LngLat(coordinate[0], coordinate[1])) as boolean;
//         } catch {
//             this.removeLayer();
//             return false;
//         }
//         // return true;
//     }

//     /**
//      * get wind layer data
//      */
//     public getData() {
//         return this.field;
//     }

//     /**
//      * set layer data
//      * @param data
//      * @returns {WindLayer}
//      */
//     public setData(data: any) {
//         if (data && data.checkFields && data.checkFields()) {
//             this.field = data;
//         } else if (isArray(data)) {
//             this.field = formatData(data);
//         } else {
//             console.error('Illegal data');
//         }

//         if (this.map && this.canvas && this.field) {
//             this.render(this.canvas);
//         }

//         return this;
//     }

//     public updateParams(options: Partial < IOptions > = {}) {
//         warnLog('will move to setWindOptions');
//         this.setWindOptions(options);
//         return this;
//     }

//     public getParams() {
//         warnLog('will move to getWindOptions');
//         return this.getWindOptions();
//     }

//     public setWindOptions(options: Partial < IOptions > ) {
//         const beforeOptions = this.options.windOptions || {};
//         this.options = assign(this.options, {
//             windOptions: assign(beforeOptions, options || {}),
//         });

//         if (this.wind) {
//             this.wind.setOptions(this.options.windOptions);
//             this.wind.prerender();
//         }
//     }

//     public getWindOptions() {
//         return this.options.windOptions || {};
//     }

//     /**
//      * get canvas context
//      * @returns {*}
//      */
//     private getContext() {
//         if (this.canvas === null) { return; }
//         return this.canvas.getContext(this.context);
//     }

//     private pickWindOptions() {
//         Object.keys(defaultOptions).forEach((key: string) => {
//             if (key in this.options) {
//                 if (this.options.windOptions === undefined) {
//                     this.options.windOptions = {};
//                 }
//                 // @ts-ignore
//                 this.options.windOptions[key] = this.options[key];
//             }
//         });
//     }
// }

// const WindLayer = AMapWind;

// export {
//     Field,
//     WindLayer,
// };

// export default AMapWind;
