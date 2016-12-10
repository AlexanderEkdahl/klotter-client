declare var require: {
  <T>(path: string): T;
  (paths: string[], callback: (...modules: any[]) => void): void;
  ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

declare module "mapbox-gl/dist/mapbox-gl.js" {
  export = mapboxgl;
}

declare module "svg-inline-react";