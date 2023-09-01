import { request } from ".";

export function login(data: Record<string, any>) {
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

export function register(data: Record<string, any>) {
  return request({
    url: "/register",
    method: "post",
    data
  });
}
