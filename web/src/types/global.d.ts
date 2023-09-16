declare global {
  declare type Recordable<T = any> = Record<string, T>;
}

declare module "qrcode"; // 用来忽略报错
