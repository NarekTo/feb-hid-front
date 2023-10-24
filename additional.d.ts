// additional.d.ts
/// <reference types="next-images" />

declare module "*.png" {
    const value: any;
    export = value;
  }