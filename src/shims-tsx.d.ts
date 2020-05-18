import Vue, { VNode } from 'vue';

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
  interface Document {
    mozFullScreenEnabled: any,
    webkitFullscreenEnabled: any,
    msFullscreenEnabled: any,
    mozCancelFullScreen: any,
    webkitCancelFullScreen: any,
  }
  interface HTMLElement {
    mozRequestFullScreen: any,
    webkitRequestFullScreen: any
  }
}
