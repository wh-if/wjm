import { request } from ".";

export type LoginParams = {
  email: string;
  password?: string;
  vcode?: string;
};

export interface User {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  status?: number;
}

export function login(data: LoginParams) {
  return request({
    url: "/login",
    method: "post",
    data
  });
}

export function logout() {
  return request({
    url: "/logout",
    method: "post"
  });
}

export function register(data: LoginParams) {
  return request({
    url: "/register",
    method: "post",
    data
  });
}

export function forgetOrUpdatePassword(data: LoginParams) {
  return request({
    url: "/password",
    method: "post",
    data
  });
}
export function updateUserData(data: Pick<User, "name" | "status">) {
  return request({
    url: "/register",
    method: "put",
    data
  });
}

export function getVerifyData(email: string, type = 1) {
  return request({
    url: "/verify/" + type,
    method: "get",
    params: {
      email
    }
  });
}
export function refreshToken() {
  return request({
    url: "/token",
    method: "post"
  });
}
