import Router from "koa-router";

export enum HttpMethodEnum {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
  HEAD = "HEAD",
}

export type Controller = {
  path: string;
  method: HttpMethodEnum;
  handler: Router.IMiddleware<any, {}> | Router.IMiddleware<any, {}>[];
};
