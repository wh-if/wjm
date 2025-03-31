// 判断是否为数组
const isArr = (origin: any): boolean => {
  const str = "[object Array]";
  return Object.prototype.toString.call(origin) == str ? true : false;
};

export const deepClone = <T>(origin: T, target?: Record<string, any> | T): T => {
  const tar = target || {};

  for (const key in origin) {
    if (Object.prototype.hasOwnProperty.call(origin, key)) {
      if (typeof origin[key] === "object" && origin[key] !== null) {
        tar[key] = isArr(origin[key]) ? [] : {};
        deepClone(origin[key], tar[key]);
      } else {
        tar[key] = origin[key];
      }
    }
  }

  return tar as T;
};
