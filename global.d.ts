declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: Date;
    dataLayer: any;
    gatag: any;
    gtag?: (...args: any[]) => void;  
  }
}

export {};
