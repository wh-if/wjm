export class AjaxResult<T = Record<string, any>> {
  /**
   * 0 成功
   * 1 失败
   * 2 token 失效
   *  */
  code: 0 | 1 | 2;
  message: string;
  data: T;
  constructor(code: 0 | 1 | 2, message: string, data: T) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
  static success(): AjaxResult;
  static success(arg: Record<string, any>): AjaxResult;
  static success(arg_1: string, arg_2?: Record<string, any>): AjaxResult;
  static success(
    arg_1?: string | Record<string, any>,
    arg_2?: Record<string, any>
  ) {
    if (typeof arg_1 === "object") {
      arg_2 = arg_1;
      arg_1 = "成功";
    }
    if (!arg_1) arg_1 = "成功";
    return new AjaxResult(0, arg_1, arg_2);
  }
  static error(message = "失败", code: 1 | 2 = 1) {
    return new AjaxResult(code, message, null);
  }
}
